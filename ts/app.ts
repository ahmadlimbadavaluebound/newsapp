class Notes {
  note:string;
  time:number;
  thread: Notes[];
  deleted: boolean;
  constructor(note:string) {
    this.note = note;
    this.time = new Date().getTime();
    this.thread = [];
    this.deleted = false;
  }
}

class Domain {
  domainName:string;
  upvote:number;
  flag:number;
  constructor(url:string) {
    this.domainName = Domain.extractRootDomain(url);
    this.upvote = 0;
    this.flag = 0;
  }
  static extractHostname(url:string):string {
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
  static extractRootDomain(url:string):string {
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
  /*static searchDomain(domainName:string, rootDomainArray:Domain[]){
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
  title:string;
  url:string;
  upvote:number;
  time:number;
  flag:boolean;
  notes:Notes[];
  constructor(title:string, url:string) {
      this.title = title;
      this.url = url;
      this.upvote = 0;
      this.time = new Date().getTime();
      this.flag = false;
      this.notes = [];
    
  }

  //validates title
  static validateTitle(title:string):boolean {
    //check no of words are less than 3 or not
    if (title.split(" ").length < 3) {
      return false;
    }
    return true;
  }
  //validates url
  static validateURL(url:string):boolean {
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    if (url.match(regex)) {
      return true;
    }
    return false;
  }
}

class NewsApp {
  posts: any;
  rootDomains: any;
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

  addPost(title:string, url:string) {
    title = title.trim().replace(/\\/g, "");
    url = url.trim().replace(/\\/g, "");
    
    if (Post.validateTitle(title) && Post.validateURL(url)) {
      var post = new Post(title,url);
      
      this.posts.push(post);
      var domain = Domain.extractRootDomain(url);
    
      if(this.rootDomains[domain] == undefined){
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

  getSpecificPost(id:number){
    return this.posts[id];
  }

  addNote(post:Post) {
    
  }
}

var newsApp:NewsApp;
newsApp = new NewsApp();

function formAddPost(){
  var title:string = document.getElementById('title').value;
  var url:string = document.getElementById('URL').value ;
  return  newsApp.addPost(title,url);
}