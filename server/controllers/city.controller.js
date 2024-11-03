const sequelize = require('../db')
const City = require('../models/city.model')

class CityController {
  async createCity(req, res) {
    try {
      const { name } = req.body
      if (
        !name ||
        typeof name !== 'string' ||
        name.length < 1 ||
        name.length > 100
      ) {
        return res.status(400).json({ error: 'Некорректное имя города' })
      }
      if (/[^a-zA-Zа-яА-ЯёЁ\s]/.test(name)) {
        return res
          .status(400)
          .json({ error: 'Имя города содержит недопустимые символы' })
      }
      const existingCity = await City.findOne({ where: { name } })

      if (existingCity) {
        return res.status(400).json({ error: 'Такой город уже существует' })
      }
      const result = await City.create({ name })
      res.json(result)
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error)
      res.status(500).json({ error: 'Ошибка при создании города' })
    }
  }

  async getAllCity(req, res) {
    try {
      const city = await City.findAll()
      res.json(city)
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error)
      res.status(500).json({ error: 'Ошибка при получении городов' })
    }
  }

  async getCityById(req, res) {
    try {
      const { id } = req.params
      if (!Number.isInteger(Number(id))) {
        return res
          .status(400)
          .json({ error: 'Некорректный идентификатор города' })
      }
      const city = await City.findByPk(id)
      res.json(city)
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error)
      res.status(500).json({ error: 'Ошибка при получении города' })
    }
  }

  async updateCity(req, res) {
    try {
      const { id } = req.params
      const { name } = req.body
      const city = await City.findByPk(id)
      if (!city) {
        return res.status(404).json({ error: 'Город не найден' })
      }
      city.name = name
      await city.save()
      res.json(city)
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error)
      res.status(500).json({ error: 'Ошибка при обновлении города' })
    }
  }

  async deleteCity(req, res) {
    try {
      const { id } = req.params
      const city = await City.findByPk(id)
      if (!city) {
        return res.status(404).json({ error: 'Город не найден' })
      }
      await city.destroy()
      res.json({ message: 'Город удален' })
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error)
      res.status(500).json({ error: 'Ошибка при удалении города' })
    }
  }
}

module.exports = CityController
