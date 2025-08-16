/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1942858786")

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "bool2781715268",
    "name": "is_custom",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "file1692590374",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "custom_icon",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1942858786")

  // remove field
  collection.fields.removeById("bool2781715268")

  // remove field
  collection.fields.removeById("file1692590374")

  return app.save(collection)
})
