# sezion-videogen-js
Video Generator client side for [sezion.com](https://www.sezion.com) using Javascript.
Permit generate videos using preconfigured blocks of content.


## Prerrequisites

- You need a Sezion account
- You have to create a new template in sezion blank.
   - In the script area in the sezion template has to be the next code
   ```
   []
   ```

## Installation
The configuration is defined in _assets/js/config.js_ 
You need to add your credential in Sezion to connect with the API
- **accountID**: The user account ID 
- **templateID**: The ID of your blank template.
- **templateSecret**: The secret of your blank template.

now just open in your browser the page _index.html_


## Features

You can create new videos uploading this type of contents:
- Text: text content like a title.
- Image: a image from your computer, Amazon S3 or URL.
- Video: a video from your computer, Amazon S3 or URL.

The content is organized in blocks (small sections of the video)

Actually is just a demo version with the next blocks:

- **INTRO**: Is a intro video. (added by default). 
- **END**: Is the end video.(added by default).
- **Text + Image**: Text quote with a background image.
- **Title + Video**: Text Title with a background video.
- **Image**: Just background image.
- **Video**: Just background video.
 

## Adding default medias

 You can add a predefined media adding the url to _assets/scripts/template-medias.js_ 
 and the name of the element (the elements are defined in _assets/scripts/autoLoaded/elements.json_)
    
 ```javascript
 var   templateMediasUrl ={
    "blockintro" : "url_media_file"
}
```
