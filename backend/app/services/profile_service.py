from sqlalchemy.orm import Session
from app.models.profile import UserProfile
from app.schemas import onboarding as schemas

class ProfileService:
    async def create_basic_info(
        self,
        db: Session,
        user_id: int,
        user_info: schemas.UserBasicInfo
    ) -> UserProfile:
        profile = UserProfile(
            user_id=user_id,
            age_group=user_info.age_group,
            gender=user_info.gender
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile

    async def update_life_stage(
        self,
        db: Session,
        user_id: int,
        life_stage: schemas.LifeStageUpdate
    ) -> UserProfile:
        profile = db.query(UserProfile).filter(
            UserProfile.user_id == user_id
        ).first()
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        profile.life_stage = life_stage.life_stage
        db.commit()
        db.refresh(profile)
        return profile

    # ... 其他方法类似

profile_service = ProfileService()