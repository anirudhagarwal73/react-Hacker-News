var storiesID=[];
var storiesCount=0;

var Img=React.createClass({
  render:function(){
    return (
      <img src={this.props.source} id={this.props.id} className={this.props.className}/>
    );
  }
});

var Heading2=React.createClass({
  render:function(){
    return (
      <h2 id="heading">{this.props.content}</h2>
    );
  }
});

var AnchorTag=React.createClass({
  handleClick:function(e){
    e.preventDefault();
    $('#top').css({"background-color": "", "color": "#999999"});
    $('#new').css({"background-color": "", "color": "#999999"});
    $('#best').css({"background-color": "", "color": "#999999"});
    $('#show').css({"background-color": "", "color": "#999999"});
    $('#jobs').css({"background-color": "", "color": "#999999"});
    $('#'+e.target.id).css({"background-color": "#fff", "color": "black"});
    $( "#overlay1" ).fadeIn( "slow");
    var myUrl=e.target.id+'stories';
    component.componentWillReceiveProps('/'+myUrl);
  },
  render:function(){
    if(this.props.type==="1"){
      return (
        <a href='#'><Img source='../images/logo.png' id="logo"/></a>
      );
    }
    else{
      return (
        <a id={this.props.id} href='#' onClick={() => this.handleClick(event)}>{this.props.content}</a>
      );
    }
  }
});

var ListElement=React.createClass({
  render:function(){
    return (
      <li className={this.props.className}>
        <AnchorTag type={this.props.type} id={this.props.id} content={this.props.content}/>
      </li>
    );
  }
});
var List=React.createClass({
  render:function(){
    return (
      <ul className="sidebar-nav">
        <ListElement type="1" className="sidebar-brand"/>
        <ListElement type="0" id="top" content="Top Stories"/>
        <ListElement type="0" id="new" content="New Stories"/>
        <ListElement type="0" id="best" content="Best Stories"/>
        <ListElement type="0" id="show" content="Show Stories"/>
        <ListElement type="0" id="job" content="Job Stories"/>
      </ul>
    );
  }
});

var Sidebar=React.createClass({
  render:function(){
    return (
      <div id="sidebar-wrapper">
        <List/>
        <a href="" className="btn btn-default affix" data-spy="affix" id="menu-toggle1"><span className="glyphicon glyphicon-list"></span> Close</a>
      </div>
    );
  }
});

var Overlay1=React.createClass({
  render:function(){
    return (
      <div id="overlay1">
        <center>
          <Img source="../images/728.gif" className="img-responsive" id="loader"/>
        </center>
      </div>
    );
  }
});

var PageContent=React.createClass({
  render:function(){
    return (
      <div id="page-content-wrapper">
        <Overlay1/>
        <Heading2 content=" Welcome to Hacker News"/>
        <a href="#menu-toggle" className="btn btn-default affix" data-spy="affix" id="menu-toggle"><span className="glyphicon glyphicon-list"></span> Menu</a>
        <br/>
        <div className="container" id="post-list">
        </div>
      </div>
    );
  }
});

var Page=React.createClass({
  render:function(){
    return (
      <div className="wrapper">
        <Sidebar/>
        <div id="content-page">
          <PageContent/>
        </div>
      </div>
    );
  }
});

var NewsBox = React.createClass({
  getInitialState: function() {
    return {
      html: []
    };
  },
  getTimeDiff: function (time){
    var now=Date.now()/1000;
    var diff=Math.ceil(now-time);
    if(Math.floor(diff/3600) === 0){
      if(Math.floor(diff/60) === 0){
        return diff+' seconds';
      }
      else {
        return Math.floor(diff/60)+' minutes';
      }
    }
    else{
      return Math.floor(diff/3600)+' hours';
    }
  },
  loadPosts: function(s,end){
    console.log(s);
    if(s>=end){
      return;
    }
    if(s>=storiesCount){
      return;
    }
    var outputArray=[];
    var ids=[];
    var e=s+5;
    var timeDiff=this.getTimeDiff;
    for(var i=s;i<e;i++)
      ids.push(storiesID[i]);
    this.serverRequest = $.post("/loadStories",{ids:ids},function(data, status){
      if(status=="success"){
        data.forEach(function(obj){
          var objJSON=JSON.parse(obj);
          objJSON.time=timeDiff(objJSON.time);
          outputArray.push(objJSON);
        });
        for(var j=0;j<5;j++){
          this.state.html.push(outputArray[j]);
        }
        this.forceUpdate();
        this.loadPosts(s+5,end);
      }
    }.bind(this));
  },
  ajaxCall:function(source){
    this.serverRequest = $.get(source, function (result) {
      storiesID=JSON.parse(result);
      storiesCount=storiesID.length;
      var outputArray=[]
      this.loadPosts(0,20);
    }.bind(this));
  },
  handleClick:function(e){
    e.preventDefault();
    this.loadPosts(this.state.html.length,this.state.html.length+20);
  },
  componentDidMount: function() {
    $('#top').css({"background-color": "#fff", "color": "black"});
    this.ajaxCall(this.props.source);
  },
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  componentWillReceiveProps:function(nextProps){
    this.state.html=[];
    this.ajaxCall(nextProps);
  },
  render: function() {
    $( "#overlay1" ).fadeOut( "slow");
    if(this.state.html.length==0){
      return (
        <div className="posts">
        hello
        </div>
      );
    }
    return (
      <div className="posts">
        {
          this.state.html.map(function(item,index){
            var masterTitle='';
            var flag=(typeof item.url !== 'undefined');
            if(flag){
              var masterUrl=item.url.split("/")[2];
              masterTitle+=' (';
              masterTitle+=masterUrl;
              masterTitle+=')';
            }
            return(
              <div>
                <div className="row">
                  <div className="col-xs-12 title">
                    {index+1}. {flag ? <a className='post-link' target='_blank' href={item.url}>{item.title}</a>:item.title}{masterTitle}
                  </div>
                </div>
                <div className="row sub-row">
                  <div className="subtext col-xs-12">
                    <span className="score">{item.score} points | </span> by {item.by} | <span className="age">{item.time} hours ago</span> | {item.descendants} comments</div>
                </div>
              </div>
            );
          })
        }
        <center id="more">
          <a href='#' onClick={() => this.handleClick(event)}>More...</a>
        </center>
      </div>
    );
  }
});

ReactDOM.render(
  <Page/>,
  document.getElementsByTagName("body")[0]
);

var component=ReactDOM.render(
  <NewsBox source="/topstories" />,
  document.getElementById("post-list")
);
