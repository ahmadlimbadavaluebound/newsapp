class Notes {
  constructor(note) {
    this.note = note;
    this.time = new Date().getTime();
    this.thread = [];
    this.deleted = false;
  }
}

class Domain {
  constructor(url) {
    this.domainName = Domain.extractRootDomain(url);
    this.upvote = 0;
    this.flag = 0;
  }
  static extractHostname(url) {
    var hostName;
    //find & remove protocol https, http and get root name
    if (url.indexOf("//") > -1) {
      hostName = url.split("/")[2];
    } else {
      hostName = url.split("/")[0];
    }
    //find & remove port number
    hostName = hostName.split(":")[0];
    //find & remove "?"
    hostName = hostName.split("?")[0];
  
    return hostName;
  }
  static extractRootDomain(url) {
    var domain = Domain.extractHostname(url),
      splitArr = domain.split("."),
      arrLen = splitArr.length;
    //extracting the root domain here
    //if there is a subdomain
    if (arrLen > 2) {
      domain = splitArr[arrLen - 2] + "." + splitArr[arrLen - 1];
      //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
      if (
        splitArr[arrLen - 2].length == 2 &&
        splitArr[arrLen - 1].length == 2
      ) {
        //this is using a ccTLD
        domain = splitArr[arrLen - 3] + "." + domain;
      }
    }
    return domain;
  }
  increamentUpvote(){
    this.upvote++;
  }
  /*static  searchDomain(domainName, rootDomainArray){
    for (var i=0; i < rootDomainArray.length; i++) {
        if (rootDomainArray[i].domainName === domainName) {
            return i;
        }
    }
    return -1;
}*/
}

class Post {
  //constructor to add post
  constructor(id,title, url) {
      this.id = id;
      this.title = title;
      this.url = url;
      this.upvote = 0;
      this.time = new Date().getTime();
      this.flag = false;
      this.notes = [];
    
  }

  increamentUpvote(){
    this.upvote++;
  }
  //validates title
  static validateTitle(title) {
    //check no of words are less than 3 or not
    if (title.split(" ").length < 3) {
      return false;
    }
    return true;
  }
  //validates url
  static validateURL(url) {
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    if (url.match(regex)) {
      return true;
    }
    return false;
  }
}

class NewsApp {
  constructor() {
    this.posts = JSON.parse(localStorage.getItem("posts"));
    this.rootDomains = JSON.parse(localStorage.getItem("rootDomains"));
    if(this.posts==null || this.posts == 'undefined'){
      this.posts = [];
    }
    if(this.rootDomains==null || this.rootDomains == 'undefined'){
      this.rootDomains = {};
    }
  }

  addPost(title, url) {
    title = title.trim().replace(/\\/g, "");
    url = url.trim().replace(/\\/g, "");

    if (Post.validateTitle(title) && Post.validateURL(url)) {
      var post = new Post(this.posts.length,title,url);
      this.posts.push(post);
      var domain = Domain.extractRootDomain(url);
    
      if(this.rootDomains[domain]==undefined){
        this.rootDomains[domain] = new Domain(domain);
      }
      this.saveToLocal();
      alert("Post added");
      return true;
    } else {
      alert("Invalid title or url");
      return false;
    }  
  }

  saveToLocal(){
    localStorage.setItem("posts",JSON.stringify(this.posts));
    localStorage.setItem("rootDomains",JSON.stringify(this.rootDomains));
  }
  getPosts(){
    return this.posts;
  }

  getLastWeekPost(){
    var lastWeekPosts = [];
    var lastweek = new Date();
    lastweek.setDate(lastweek.getDate() - 7);
    for(var i=this.posts.length-1;i>=0;i--){
      if(this.posts[i].time < lastweek){
        break;
      }
      lastWeekPosts.push(this.posts[i]);
    }
    return lastWeekPosts;
  }
  static compare( a, b ) {
    if ( a.upvote < b.upvote ){
      return 1;
    }
    if ( a.upvote > b.upvote ){
      return -1;
    }
    return 0;
  }
  getSpecificPost(id){
    return this.posts[id];
  }

  increamentUpvote(id){
    this.posts[id].upvote++;
    this.rootDomains[Domain.extractRootDomain(this.posts[id].url)].upvote++;
    this.saveToLocal();
  }
  flagUnflag(id){
    this.posts[id].flag = !this.posts[id].flag;
    if(this.posts[id].flag){
      this.rootDomains[Domain.extractRootDomain(this.posts[id].url)].flag++;
    }
    else{
      this.rootDomains[Domain.extractRootDomain(this.posts[id].url)].flag--;
    }
    this.saveToLocal();
  }
  addNote(post) {
  }
}

newsApp = new NewsApp();

function formAddPost(){
  var title = document.getElementById('title').value;
  var url = document.getElementById('URL').value.toLowerCase();
  return newsApp.addPost(title,url);
 
}

function timeDiffCalc(dateFuture, dateNow) {

  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;

  let difference = 'Posted ';
  if (days > 0) {
    difference +=  `${days} days, `;
  }
  if(hours>0){ 
    
  difference +=  `${hours} hours, `;

  }
  if(minutes>0){
    
  difference += `${minutes} minutes`; 
  }
  difference += ` ago `
  return difference;
}

function loadPosts(){
  var posts = newsApp.getLastWeekPost();
  posts.sort(NewsApp.compare);
  var count = 1;
  var row = `<tr class="header" >
  <td colspan="2"><button class="headerLogo" onClick="window.location.href='index.html';">A</button><p class="headertext">&nbsp; News App &nbsp;<a href="AddPost.html" class="headerLinks">New</a> | <a href='#' class="headerLinks">Submit</a></a></p></td>
</tr>`;
  for(var i=0;i<posts.length;i++){
    var isFlagged = 'flag';
    if(posts[i].flag){
      isFlagged = 'unflag';
    }
    row += 
    `<tr>
      <td rowspan='2' class='sl'>
        ${count}</td><td><a class='title' href='${posts[i].url}'>${posts[i].title}</a>
        <a href="" class='littlegraytext'>
            (${Domain.extractRootDomain(posts[i].url)})
        </a>
      </td>
    </tr>
    <tr>
      <td>
        <button class='btnUpvoteAndFlag' onClick='increaseCount(${posts[i].id})'>^</button> <span class='littlegraytext'>${posts[i].upvote} votes</span> | 
        <span class='littlegraytext'>${timeDiffCalc(posts[i].time, new Date())}</span> | 
        <span class='littlegraytext'>${posts[i].notes.length} notes</span> |
        <span class='littlegraytext'><button class='btnUpvoteAndFlag' onClick='flagUnflag(${posts[i].id})'>${isFlagged}</button></span>
      </td>
    </tr>`;
    count++;
  }
  document.getElementById("posts").innerHTML = row;
}

function increaseCount(id){
  newsApp.increamentUpvote(id);
  loadPosts();
}

function flagUnflag(id){
  newsApp.flagUnflag(id);
  loadPosts();
}
