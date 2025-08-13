/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1935361188")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id = user_id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1935361188")

  // update collection data
  unmarshal({
    "createRule": null
  }, collection)

  return app.save(collection)
})
