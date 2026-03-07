const express = require('express');
const router = express.Router();
const { getAssets, getAssetById, createAsset, updateAsset, deleteAsset, getStats } = require('../controllers/assetController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getAssets)
    .post(protect, createAsset);

router.get('/stats', protect, getStats);

router.route('/:id')
    .get(protect, getAssetById)
    .put(protect, updateAsset)
    .delete(protect, deleteAsset);

module.exports = router;
