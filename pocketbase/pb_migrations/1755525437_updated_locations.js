/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1942858786")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "bool2781715268",
    "name": "has_qr_code",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1942858786")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "bool2781715268",
    "name": "is_custom",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
