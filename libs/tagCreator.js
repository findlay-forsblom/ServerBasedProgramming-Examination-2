'use strict'
const tagCreator = {}

tagCreator.create = async (split, snipet, Tag, user) => {
  for (let element of split) {
    element = element.trim()
    element = element.toLowerCase()
    element = element.charAt(0).toUpperCase() + element.slice(1)
    const tag = await Tag.findOne({ name: element })
    if (tag) {
      snipet.tag.push(tag)
      await snipet.save()
      tag.snipet.push(snipet)
      await tag.save()
    } else {
      const newTag = new Tag({
        name: element
      })
      await snipet.save()
      newTag.snipet.push(snipet)
      await newTag.save()
      snipet.tag.push(newTag)
      await snipet.save()
    }
    if (user) {
      user.snipets.push(snipet)
      await user.save()
    }
  }
}

module.exports = tagCreator
