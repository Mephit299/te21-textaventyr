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

router.get('/dbtest', async (req, res) => {
  try {
    const [parts] = await pool.promise().query('SELECT * FROM levi_part')
    res.json({parts})
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

module.exports = router
