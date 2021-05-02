## TODO

# Quick Start

Basically -> Get feed working, get upload working with metadata, deploy to AWS and troubleshoot, get works for itemDetail, implement put for itemDetail (back-end and front-end), code cleanup & documentation, security and validation check, end-to-end test with selenium for key workflows, AWS should build from typescript and I should add the js to the .gitignore (this way I can use typescript to run dev server as well)

* User needs to be in TreeDocument
* Feed needs to retrieve TreeDocuments based on user
* Extract EXIF data from uploaded photos and store that in photo metadata stored on Mongo

# Backlog


* LatinName + UserId needs to be unique identifier -- do I need to implement anything for this?
* Figure out how to have my AWS server build my typescript file instead of uploads my js to the github
* When there is already a tree that exists, don't save the image
* SEO with React Helmet
* Have authentication optional routes for user feeds
* Limit photo size sent to EFS. Try compressing on the client side and also having a check on the server side for bad actors
* Code cleanup
* API documentation
* Ability to update a tree (/PUT request)
* Feed based on real data and not the stream

## Useful Commands

# AWS

* eb ssh to log into the environment
* Check if filesystem is mounted with df -T and looks for /efs
* navigate into the filesystem with cd ~ and then cd /efs