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

router.get('/visons', function (req,res){
  if (req.body.visions)
  req.session.visions = true
})

router.get('/story/:id', function (req, res) {
  let part = story.parts.find((part) => part.id === parseInt(req.params.id))
  if (!part) {
    res.status(404).render('404.njk', { title: '404' })
    return
  }

  const name = part.name.replace('[PLAYER]', req.session.username)
  part = { ...part, name: name}
  res.render('part.njk', { title: name, part: part })
})

module.exports = router
