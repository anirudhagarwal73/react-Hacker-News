return
  <div>
    {
      this.state.story.map(function(item){
        return(
          <div className="row">
            <div className="col-xs-12 title">
            {item}
            </div>
          </div>
        );
      })
    }
    <br/>
    <div onClick={this.addClick}>ADD</div>
  </div>;
  var storiesID=[];
  var storiesCount=0;
  var storyNo=0;
  var pageno=0;
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
        story: []
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
    pagination:function(type){
      if(type==1){
        var htmladd='<center id="more"><a href="#" onclick="loadMore(event,this)">More...</a></center>';
      }
      if(type==2){
        var htmladd='<center id="more">No More...</center>';
      }
      $('#page-content-wrapper').append(htmladd);
    },
    loadPosts: function(s,end){
      if(s>=storiesCount){
       this.pagination(2);
       return;
      }
      if(s>=end){
        this.pagination(1);
        return;
      }
      var ids=[];
      console.log(s);
      var e=s+5;
      for(var i=s;i<e;i++)
        ids.push(storiesID[i]);
      var timeDiff=this.getTimeDiff;
      this.serverRequest = $.post("/loadStories",{ids:ids},function(data, status){
        if(status=="success"){
          var htmlAddition;
          data.forEach(function(obj){
            htmlAddition=JSON.parse(obj);
          });
          this.setState({
            story: htmlAddition
          });
          this.forceUpdate();
          console.log(this.state.story);
        }
      }.bind(this));
    },
    ajaxCall:function(source){
      $("#overlay1").fadeOut("slow");
      this.serverRequest = $.get(source, function (result,status) {
        console.log(status);
        storiesID=JSON.parse(result);
        storiesCount=storiesID.length;
        storyNo=0;
        $('#post-list').empty();
        $( '#more' ).remove();
        this.loadPosts(0,20);
      }.bind(this));
    },
    componentDidMount: function() {
      this.ajaxCall(this.props.source);
    },
    componentWillUnmount: function() {
      this.serverRequest.abort();
    },
    componentWillReceiveProps:function(nextProps){
      this.ajaxCall(nextProps);
    },
    render: function() {
      return (
        <div>
          Hell
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
