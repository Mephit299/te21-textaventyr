const express = require('express')
const router = express.Router()

const story = require('../data/story.json')

router.get('/', function (req, res) {
  console.log(story.parts[0])
  res.render('index.njk', { title: 'Welcome', part: story.parts[0] })
})

router.post('/username', function(req, res){
  req.session.username = req.body.username
  console.log(req.session.username)
  res.redirect('/story/0')
})

//router.post('/inventory', function(req, res){
  // req.session.inventory = req.body.item
//  req.session.inventory = [...req.session.inventory, req.body.item]
//  console.log(req.session.inventory)
//  res.redirect('/story/0')
//})

router.get('/story/:id', function (req, res) {
  let part = story.parts.find((part) => part.id === parseInt(req.params.id))
  try {
    if (part.vision)
      req.session.vision = true
    } catch (error) {}
  if (!part) {
    res.status(404).render('404.njk', { title: '404' })
    if (req.session.vision){
      const placeholder = document.createElement ('p');
      placeholder.innerHTML = "pog"
      document.getElementById("placeholder").appendChild(placeholder) // this does not work :(
    }
    
    return
  }

  const name = part.name.replace('[PLAYER]', req.session.username)
  part = { ...part, name: name}
  res.render('part.njk', { title: name, part: part })
})

const pool = require('../db')

router.get('/dbtest/:id', async (req, res) => {
  try {
    const id = req.params.id
    const [parts] = await pool.promise().query(`SELECT * FROM levi_part WHERE id = ${id}`)
    const [options] = await pool.promise().query(`SELECT * FROM levi_option WHERE part_id = ${id}`)
    res.json({parts, options})
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

module.exports = router
