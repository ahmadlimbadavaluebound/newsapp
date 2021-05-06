# newsapp
## Project | Hackernews clone for personal use
### Constraints
* Write the program completely in plain typescript/javascript/html/css
* Do not use any external library/code(e.g. jquery or piece of code from stackoverflow/github/codepen)
* javascript code must be completely separated from html/css and should be in a single file
### Project Brief
Clone of [Hackernews](https://news.ycombinator.com) - A link sharing and note taking website for personal use
### User Stories 
#### Create post
* User should be able to submit a post. Fields - url, title
* Validate links(should be valid url)
* Make sure the title has more than 3 words
* User should be able to enter url with or without `https://` or `http://`
#### Posts list and upvote
* User should be able to see list of posts since last one week, sorted by votes(highest first). 
Fields - title, link's root domain, #of votes, posted x min/hrs/days ago, # of notes, **# of flags(# of people who mark the post as spam)**
* User should be able to click the post title and that should take the user to the submitted url
* User should be able to upvote the post.
* User should be able to flag the post as spam. Max. 1 flag can be counted per user for a specific post.
* User should be able to unflag a post.
* Clicking the "# of notes" should take the user to post detail page which should look [similar to this](https://news.ycombinator.com/item?id=27052840)
#### Post details and notes
* User should be add notes [similar to this](https://news.ycombinator.com/item?id=27052840).
Fields - posted x min/days/week/years ago, comment text
* User should be able to delete their note for the post
* User should be able to reply to their note as a thread
* When user deltes a thread parent note, it should not delete the children
#### Analytics
* User should able to see the list of "Most Spammy" domains(root domains sorted by # of flags). Fields - root domain, aggregated # of flags
* ~~User should be able to see the "Most Upvoted" domains(root domains). Fields - root domain, aggregated # of upvotes~~
#### Data
* Store all the data(posts, notes, etc.) in localStorage
### Submission Guidelines
* Create a [codesandbox](https://codesandbox.io) link(or similar platform e.g. repl, gitpod, etc) and share it to with me via DM
* Mention some relevant details on top of the javascript file as following 
```
// This submission is for assignment for Full Stack Developer Training at Invide 
// Datetime Of Submission : 
// Student Name : 
// License : MIT
```
