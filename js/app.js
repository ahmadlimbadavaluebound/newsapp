var Notes = /** @class */ (function () {
  function Notes(id, note, parent) {
      if (parent === void 0) { parent = 0; }
      this.note = note;
      this.time = new Date().getTime();
      this.thread = [];
      this.deleted = false;
      this.id = id;
      this.parent = parent;
  }
  return Notes;
}());
var Domain = /** @class */ (function () {
  function Domain(url) {
      this.domainName = Domain.extractRootDomain(url);
      this.upvote = 0;
      this.flag = 0;
  }
  Domain.extractHostname = function (url) {
      var hostName;
      //find & remove protocol https, http and get root name
      if (url.indexOf("//") > -1) {
          hostName = url.split("/")[2];
      }
      else {
          hostName = url.split("/")[0];
      }
      //find & remove port number
      hostName = hostName.split(":")[0];
      //find & remove "?"
      hostName = hostName.split("?")[0];
      return hostName;
  };
  Domain.extractRootDomain = function (url) {
      var domain = Domain.extractHostname(url), splitArr = domain.split("."), arrLen = splitArr.length;
      //extracting the root domain here
      //if there is a subdomain
      if (arrLen > 2) {
          domain = splitArr[arrLen - 2] + "." + splitArr[arrLen - 1];
          //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
          if (splitArr[arrLen - 2].length == 2 &&
              splitArr[arrLen - 1].length == 2) {
              //this is using a ccTLD
              domain = splitArr[arrLen - 3] + "." + domain;
          }
      }
      return domain;
  };
  //used for sorting by upvote in descending order
  Domain.compareUpvote = function (a, b) {
      if (a.upvote < b.upvote) {
          return 1;
      }
      if (a.upvote > b.upvote) {
          return -1;
      }
      return 0;
  };
  //used for sorting by flag in descending order
  Domain.compareFlag = function (a, b) {
      if (a.flag < b.flag) {
          return 1;
      }
      if (a.flag > b.flag) {
          return -1;
      }
      return 0;
  };
  return Domain;
}());
var Post = /** @class */ (function () {
  function Post(id, title, url) {
      this.id = id;
      this.title = title;
      this.url = url;
      this.upvote = 0;
      this.time = new Date().getTime();
      this.flag = false;
      this.notes = [];
  }
  //validates title
  Post.validateTitle = function (title) {
      //check no of words are less than 3 or not
      if (title.split(" ").length < 3) {
          return false;
      }
      return true;
  };
  //validates url
  Post.validateURL = function (url) {
      var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
      var regex = new RegExp(expression);
      if (url.match(regex)) {
          return true;
      }
      return false;
  };
  return Post;
}());
var NewsApp = /** @class */ (function () {
  function NewsApp() {
      //fetch posts and root domains from local storage
      this.posts = JSON.parse(localStorage.getItem("posts") || "");
      ;
      this.rootDomains = JSON.parse(localStorage.getItem("rootDomains") || "");
      //if posts or rootdomains not found then assign default value
      if (this.posts == null || this.posts == undefined) {
          this.posts = [];
      }
      if (this.rootDomains == null || this.rootDomains == undefined) {
          this.rootDomains = {};
      }
  }
  //adds new Post to the posts property
  NewsApp.prototype.addPost = function (title, url) {
      title = title.trim().replace(/\\/g, "");
      url = url.trim().replace(/\\/g, "");
      //validate title and url
      if (Post.validateTitle(title) && Post.validateURL(url)) {
          var post = new Post(this.posts.length, title, url);
          //add post to the post attyribute
          if (typeof this.posts == typeof []) {
              this.posts.push(post);
          }
          //fetch domain of post
          var domain = Domain.extractRootDomain(url);
          //check that domain exist in rootdomains and if not add it
          if (this.rootDomains[domain] == undefined) {
              this.rootDomains[domain] = new Domain(domain);
          }
          //save change to localstorage
          this.saveToLocal();
          alert("Post added");
          return true;
      }
      else {
          alert("Invalid title or url");
          return false;
      }
  };
  //saves posts and rootdomains to localstorage
  NewsApp.prototype.saveToLocal = function () {
      localStorage.setItem("posts", JSON.stringify(this.posts));
      localStorage.setItem("rootDomains", JSON.stringify(this.rootDomains));
  };
  //returns all posts
  NewsApp.prototype.getPosts = function () {
      return this.posts;
  };
  //return last week post from todays date
  NewsApp.prototype.getLastWeekPost = function () {
      var lastWeekPosts = [];
      var lastweek = new Date();
      //deduct 7 days from todays date
      lastweek.setDate(lastweek.getDate() - 7);
      //iterate from last to first and whenever post is before 7 days stop iterating
      for (var i = this.posts.length - 1; i >= 0; i--) {
          if (this.posts[i].time < lastweek) {
              break;
          }
          //adds the post to returning array
          lastWeekPosts.push(this.posts[i]);
      }
      //return the generated array
      return lastWeekPosts;
  };
  //compares post with attribute upvote
  NewsApp.compare = function (a, b) {
      if (a.upvote < b.upvote) {
          return 1;
      }
      if (a.upvote > b.upvote) {
          return -1;
      }
      return 0;
  };
  //returns specific post
  NewsApp.prototype.getSpecificPost = function (id) {
      return this.posts[id];
  };
  //increments upvote of particular post and it's root domain
  NewsApp.prototype.increamentUpvote = function (id) {
      this.posts[id].upvote++;
      this.rootDomains[Domain.extractRootDomain(this.posts[id].url)].upvote++;
      this.saveToLocal();
  };
  //increments flag of particular post and it's root domain
  NewsApp.prototype.flagUnflag = function (id) {
      this.posts[id].flag = !this.posts[id].flag;
      if (this.posts[id].flag) {
          this.rootDomains[Domain.extractRootDomain(this.posts[id].url)].flag++;
      }
      else {
          this.rootDomains[Domain.extractRootDomain(this.posts[id].url)].flag--;
      }
      this.saveToLocal();
  };
  //returns all root domains as an array sorted by flag count in descending order
  NewsApp.prototype.getTopSpammy = function () {
      var roots = [];
      for (var i in this.rootDomains) {
          roots.push(this.rootDomains[i]);
      }
      return roots.sort(Domain.compareFlag);
  };
  //returns all root domains as an array sorted by upvote count in descending order
  NewsApp.prototype.getTopVoted = function () {
      var roots = [];
      for (var i in this.rootDomains) {
          roots.push(this.rootDomains[i]);
      }
      return roots.sort(Domain.compareUpvote);
  };
  //adds note to the post
  NewsApp.prototype.addNote = function (pid, data) {
      //validate note
      if (data == null || data == undefined || data == "") {
          alert("please enter valid comment");
          return false;
      }
      this.posts[pid].notes.push(new Notes(this.posts[pid].notes.length, data));
      this.saveToLocal();
      return true;
  };
  //deletes note from the post
  NewsApp.prototype.deleteComment = function (pid, cid) {
      this.posts[pid].notes[cid].deleted = true;
      this.saveToLocal();
  };
  return NewsApp;
}());
var newsApp = new NewsApp();
//handles form submission
function formAddPost() {
  var title = document.getElementById("title");
  var url = document.getElementById("URL");
  return newsApp.addPost(title.value, url.value.toLowerCase());
}
//callculates the time difference between dateFuture and dateNow
function timeDiffCalc(dateFuture, dateNow) {
  var diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;
  // calculate days 86400 seconds in a day
  var days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;
  // calculate hours 3600 seconds in hour
  var hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;
  // calculate minutes 60
  var minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;
  var difference = "Posted ";
  if (days > 0) {
      difference += days + " days, ";
  }
  if (hours > 0) {
      difference += hours + " hours, ";
  }
  if (minutes > 0) {
      difference += minutes + " minutes, ";
  }
  difference += Math.floor(diffInMilliSeconds) + " seconds ago ";
  return difference;
}
//loads all post and show it in html
function loadPosts() {
  var posts = newsApp.getLastWeekPost();
  posts.sort(NewsApp.compare);
  var count = 1;
  var row = "<tr class=\"header\" >\n  <td colspan=\"2\">\n      <button class=\"headerLogo\" onClick='window.location.href=\"index.html\";'>A</button>\n      <p class=\"headertext\">&nbsp;News App &nbsp;<a href=\"AddPost.html\" class=\"headerLinks\">New</a> | <a href='MostSpammy.html' class=\"headerLinks\">Most Spammy</a> | <a href='MostUpvoted.html' class=\"headerLinks\">Most Upvoted</a></p>\n  </td>\n</tr>";
  for (var i = 0; i < posts.length; i++) {
      var isFlagged = "flag";
      if (posts[i].flag) {
          isFlagged = "unflag";
      }
      row += "<tr>\n      <td rowspan='2' class='sl'>\n        " + count + "</td><td><a class='title' href='" + posts[i].url + "'>" + posts[i].title + "</a>\n        <a href=\"\" class='littlegraytext'>\n            (" + Domain.extractRootDomain(posts[i].url) + ")\n        </a>\n      </td>\n    </tr>\n    <tr>\n      <td>\n        <button class='btnUpvoteAndFlag' onClick='increaseCount(" + posts[i].id + ")'>^</button> <span class='littlegraytext'>" + posts[i].upvote + " votes</span> | \n        <span class='littlegraytext'>" + timeDiffCalc(posts[i].time, new Date()) + "</span> | \n        <a class='littlegraytext' href='Notes.html?pid=" + posts[i].id + "'>" + posts[i].notes.length + " notes</a> |\n        <span class='littlegraytext'><button class='btnUpvoteAndFlag' onClick='flagUnflag(" + posts[i].id + ")'>" + isFlagged + "</button></span>\n      </td>\n    </tr>";
      count++;
  }
  var postsTable = document.querySelector("#posts");
  if (postsTable != null) {
      postsTable.innerHTML = row;
  }
}
//handles increase upvote when user clicks on upvote button
function increaseCount(id, isnote) {
  if (isnote === void 0) { isnote = false; }
  newsApp.increamentUpvote(id);
  if (isnote) {
      loadNotes();
  }
  else {
      loadPosts();
  }
}
//handles flag button of htmls
function flagUnflag(id, isnote) {
  if (isnote === void 0) { isnote = false; }
  newsApp.flagUnflag(id);
  if (isnote) {
      loadNotes();
  }
  else {
      loadPosts();
  }
}
//load top spammed domains and show it in html
function Spammy() {
  var row = "<tr class=\"header\" >\n  <td colspan=\"3\">\n      <button class=\"headerLogo\" onClick='window.location.href=\"index.html\";'>A</button>\n      <p class=\"headertext\">&nbsp;News App &nbsp;<a href=\"AddPost.html\" class=\"headerLinks\">New</a> | <a href='MostSpammy.html' class=\"headerLinks\">Most Spammy</a> | <a href='MostUpvoted.html' class=\"headerLinks\">Most Upvoted</a></p>\n  </td>\n</tr><tr>\n<th colspan=\"3\">Most Spammy Domains</th>\n</tr>\n<tr>\n<th>sl</th><th>Domain Name</th><th>Total Flags</th></tr>";
  var spammedDomains = newsApp.getTopSpammy();
  for (var i = 0; i < spammedDomains.length && i < 10; i++) {
      if (spammedDomains[i].flag < 1) {
          break;
      }
      row += "<tr class='center'>\n      <td>" + (i + 1) + "</td>\n      <td>" + spammedDomains[i].domainName + "</td>\n      <td>" + spammedDomains[i].flag + "</td>\n    </tr>";
  }
  var spammyTable = document.getElementById("spammy");
  spammyTable.innerHTML = row;
}
//load top upvoted domains and show it to the user
function Upvoted() {
  var row = "<tr class=\"header\" >\n  <td colspan=\"3\">\n      <button class=\"headerLogo\" onClick='window.location.href=\"index.html\";'>A</button>\n      <p class=\"headertext\">&nbsp;News App &nbsp;<a href=\"AddPost.html\" class=\"headerLinks\">New</a> | <a href='MostSpammy.html' class=\"headerLinks\">Most Spammy</a> | <a href='MostUpvoted.html' class=\"headerLinks\">Most Upvoted</a></p>\n  </td>\n</tr><tr>\n<th colspan=\"3\">Most Upvoted Domains</th>\n</tr>\n<tr>\n<th>sl</th><th>Domain Name</th><th>Total Upvotes</th></tr>";
  var topDomains = newsApp.getTopVoted();
  for (var i = 0; i < topDomains.length && i < 10; i++) {
      row += "<tr class='center'>\n      <td>" + (i + 1) + "</td>\n      <td>" + topDomains[i].domainName + "</td>\n      <td>" + topDomains[i].upvote + "</td>\n    </tr>";
  }
  var upVotedTable = document.getElementById("upvoted");
  upVotedTable.innerHTML = row;
}
//load notes for the post
function loadNotes() {
  var urlParams = new URLSearchParams(window.location.search);
  var pid = urlParams.get("pid") || "";
  var nid = urlParams.get("nid");
  if (nid == null || nid == undefined) {
      loadPostNotes(parseInt(pid));
  }
  else {
      loadNotesThread(parseInt(pid), parseInt(nid));
  }
}
//loads notes of specified post
function loadPostNotes(pid) {
  var row = "<tr class=\"header\" >\n  <td colspan=\"3\">\n      <button class=\"headerLogo\" onClick='window.location.href=\"index.html\";'>A</button>\n      <p class=\"headertext\">&nbsp;News App &nbsp;<a href=\"AddPost.html\" class=\"headerLinks\">New</a> | <a href='MostSpammy.html' class=\"headerLinks\">Most Spammy</a> | <a href='MostUpvoted.html' class=\"headerLinks\">Most Upvoted</a></p>\n  </td>\n</tr>";
  var post = newsApp.getSpecificPost(pid);
  var isFlagged = "flag";
  if (post.flag) {
      isFlagged = "unflag";
  }
  row += "<tr>\n  <td><a class='title' href='" + post.url + "'>" + post.title + "</a>\n    <a href=\"\" class='littlegraytext'>\n        (" + Domain.extractRootDomain(post.url) + ")\n    </a>\n  </td>\n</tr>\n<tr>\n  <td>\n    <button class='btnUpvoteAndFlag' onClick='increaseCount(" + post.id + ")'>^</button> <span class='littlegraytext'>" + post.upvote + " votes</span> | \n    <span class='littlegraytext'>" + timeDiffCalc(post.time, new Date()) + "</span> | \n    <a class='littlegraytext' href='Notes.html?pid=" + post.id + "'>" + post.notes.length + " notes</a> |\n    <span class='littlegraytext'><button class='btnUpvoteAndFlag' onClick='flagUnflag(" + post.id + "," + true + ")'>" + isFlagged + "</button></span>\n  </td>\n</tr>";
  row += "<tr><td colspan='2'><form method='get' action='Notes.html' onSubmit='return addNote(" + pid + ");'><input type='hidden' id='pid' name='pid' value='" + pid + "'/><textarea id='postnote' rows=4 cols='30'></textarea><br/><input type='submit' value='Add Note'></form></td></tr>";
  row += loadNotesRecursively(post);
  var notesTable = document.getElementById("notes");
  notesTable.innerHTML = row;
}
function loadNotesThread(pid, nid) { }
//handle add note button click on Notes.html
function addNote(pid) {
  var data = document.getElementById("postnote");
  return newsApp.addNote(pid, data.value.trim());
}
//load Notes Recurssively
function loadNotesRecursively(post) {
  var notes = "";
  for (var i in post.notes) {
      notes += "<tr><td class='littlegraytext'>&nbsp;" + timeDiffCalc(post.notes[i].time, new Date()) + "</td></tr>";
      var classforComment = "";
      if (post.notes[i].deleted) {
          classforComment = "deletedNote";
      }
      notes += "<tr><td class='" + classforComment + "'>&nbsp;" + post.notes[i].note + "</td></tr>";
      notes += "<tr><td>&nbsp;<a href='#' class='note'>reply</a> <span class='littlegraytext'><button class='btnUpvoteAndFlag note' onClick='deleteComment(" + post.id + "," + post.notes[i].id + ")'>delete</button></span></td></tr>";
  }
  return notes;
}
//handles deleteComment button action
function deleteComment(pid, cid) {
  newsApp.deleteComment(pid, cid);
  loadNotes();
}
