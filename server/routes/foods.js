import express from 'express'
import { searchFoodsByName, getFirstFoodByName } from '../services/foodsService.js'

const router = express.Router()

// GET /api/foods/search?query=...&limit=...
router.get('/search', async (req, res) => {
  const { query, limit } = req.query

  if (!query) {
    return res.status(400).json({ error: 'query wajib diisi' })
  }

  try {
    const foods = await searchFoodsByName(query, limit ? Number(limit) : 5)
    res.json({ data: foods })
  } catch (error) {
    console.error('Error searchFoodsByName:', error)
    res.status(500).json({ error: 'Gagal mencari makanan' })
  }
})

// GET /api/foods/first?query=...
router.get('/first', async (req, res) => {
  const { query } = req.query

  if (!query) {
    return res.status(400).json({ error: 'query wajib diisi' })
  }

  try {
    const food = await getFirstFoodByName(query)
    res.json({ data: food })
  } catch (error) {
    console.error('Error getFirstFoodByName:', error)
    res.status(500).json({ error: 'Gagal mengambil data makanan' })
  }
})

export default router
