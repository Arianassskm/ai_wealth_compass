# app/services/prediction_service.py
from sqlalchemy.orm import Session
from app.models.ai import AIPrediction, UserCalibration
from app.schemas import prediction as schemas
from app.services import algorithm_service
from app.core.exceptions import PredictionException

class PredictionService:
    def __init__(self):
        self.algorithm_service = algorithm_service.AlgorithmService()

    async def generate_initial_prediction(
        self,
        db: Session,
        user_id: int
    ) -> AIPrediction:
        """生成初始预测"""
        try:
            # 获取用户画像
            user_profile = await self._get_user_profile(db, user_id)
            
            # 获取基础计算结果
            base_calculation = await self.algorithm_service.calculate_base_metrics(
                user_profile
            )
            
            # 获取统计参考数据
            statistical_ref = await self.algorithm_service.get_statistical_reference(
                user_profile
            )
            
            # 生成AI预测
            prediction = await self._generate_ai_prediction(
                db,
                user_id,
                base_calculation,
                statistical_ref
            )
            
            return prediction
            
        except Exception as e:
            raise PredictionException(
                f"Error generating initial prediction: {str(e)}"
            )

    async def calibrate_prediction(
        self,
        db: Session,
        user_id: int,
        adjustment: schemas.PredictionAdjustment
    ) -> AIPrediction:
        """校准预测结果"""
        try:
            # 获取最新预测
            current_prediction = await self._get_latest_prediction(db, user_id)
            
            # 记录校准
            calibration = UserCalibration(
                user_id=user_id,
                prediction_id=current_prediction.id,
                adjustment_type=adjustment.prediction_type,
                original_values=current_prediction.predicted_values,
                adjustments=adjustment.adjustments,
                reason=adjustment.reason
            )
            
            db.add(calibration)
            db.commit()
            
            # 更新预测
            return await self._update_prediction(
                db,
                current_prediction,
                adjustment
            )
            
        except Exception as e:
            raise PredictionException(
                f"Error calibrating prediction: {str(e)}"
            )

    async def process_deep_calibration(
        self,
        db: Session,
        user_id: int,
        adjustment: schemas.PredictionAdjustment
    ):
        """处理深度校准（后台任务）"""
        try:
            # 进行深度分析
            analysis_result = await self.algorithm_service.analyze_adjustment_impact(
                db, user_id, adjustment
            )
            
            # 更新相关预测
            await self._update_related_predictions(db, user_id, analysis_result)
            
        except Exception as e:
            # 记录错误日志但不中断流程
            logger.error(f"Deep calibration error: {str(e)}")

    async def get_prediction_history(
        self,
        db: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 10
    ) -> List[AIPrediction]:
        """获取预测历史"""
        return db.query(AIPrediction).filter(
            AIPrediction.user_id == user_id
        ).order_by(
            AIPrediction.created_at.desc()
        ).offset(skip).limit(limit).all()

prediction_service = PredictionService()