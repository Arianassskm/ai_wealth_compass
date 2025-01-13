const express = require('express')
const router = express.Router()
const { UserModel } = require('../models/user')
const auth = require('../middleware/auth')

// 获取用户资料
router.get('/', auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// 更新用户资料
router.put('/', auth, async (req, res) => {
  try {
    const updatedUser = await UserModel.updateProfile(req.user.id, req.body)
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router 