# Image Sharing Service

An assets sharing service.


### Build and Run Container
```bash

# build and run service locally in Docker
$ make
# the service is now running on http://localhost:3000

# other commands
# build service
$ make build

# run service
$ make run

# the service is now running on http://localhost:3000
```

### Postman Tests
```bash
# in terminal,
$ make run

# in a new terminal tab
$ make test
```

## APIs

A Postman collection in the [postman folder](./postman) can help get started. There is no API key at the moment, but that is a header that would need to be added in the future (in addition to the authentication).

API | Description
--- | ---
`GET /health` | Returns a string 'Server is healthy.' Used for basic healthcheck.
`GET /images` | Returns an array of stored images
`GET /images/{imageId}` | Returns an array of a single image object
`GET /images/tags/{tagId}` | Returns an array of image objects with that tag
`GET /images/keyword/{keyword}` | Returns an array image objects with keyword
`POST /images` | Adds image and its data to db and returns new image's data
`DELETE /images/imageId` | Deletes the image and its data from db
`GET /tags` | Returns an array tags in the db


### Supported Upload Formats

Type | MimeType | File Extension
--- | --- | ---
Jpeg Image | `image/jpeg`  | `.jpeg`
Jpeg Image | `image/jpg`  | `.jpg`
PNG Image | `image/png`  | `.png`
GIF Image | `image/gif` | `.gif`


### Future Improvements
Aside from one of the obvious that the front-end is horribly designed and needs a makeover, these are the other areas that could be improved upon:

##### Security
- An API Key header should be added (in addition to the authentication)
- The error handling for text input leaves a lot to be desired. Ideas:
    - Sanitize the input with an allowlist because right now I strip everything potentially malicious and users will want to add descriptions that are more fun.
    - The file itself isn't getting verified that it matches the mime type or file extension.
    - Validate that the text limits I set actually do make sense
- This could use a gateway that throttles users so that they can't ping the service unreasonably

###### Client friendliness
- The errors should be made into their own class extending Errors with the type they are.
    - Ex. BadRequestError extends Error and throw that error with special handing for client requests
    - In general the 400 errors could be a lot more client friendly and specific to the actual error itself to help the client pass in the correct parameters and know what they did wrong. ex. 404's if the id can't be found vs. a 400.
    - Realizing now that the POST request could be `/images/create` to specify that it is creating an image

##### Automation
- Unit tests are needed
- Swagger gives really good self-documenting tests, and it can be integrated with JSDoc to just have a comment above the API with the tests
- Load tests would be useful, maybe with Locust

##### General
- All the APIs are for single transactions, but in real life a requirement that would come about is multiple images added/updated/deleted at a time. I tried to make these able to expand to handle that
- An image update API would probably be needed at some point
- Adding albums could also be a next step, and in the UI address whether or not an image is set to a specific album (these initial ones are not)
- An .env file would be useful for development purposes when running locally vs in docker vs eventually on dev/stage/prod services
- The exact data getting put into the images database should be extracted out as a type in an easily referenced/updated place (ex. name/description/tags)
- I like comments on all the functions when not using typescript to show what exactly is getting passed, so there should be more of those.
- Instead of mounting a volume here, the image storage would be both more secure and maintainable in S3 or another cloud storage service
- The React components should really be their own file and the Javscript CSS should be in its own file as well
- There is dupicated code in the ImageAPIs.js file connecting to the db that could be its own function and called
- Fix image upload in the UI