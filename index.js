var React=require("react");

var E=React.createElement;
var PT=React.PropTypes;
var SegFilter=React.createClass({
	propTypes:{
		"regex":PT.string
		,"texts":PT.object.isRequired
		,"onGoSegment":PT.func
	}
	,getInitialState:function() {
		return {itemindex:0,texts:this.props.texts,match:[],regex:this.props.regex};
	}
	,componentWillMount:function() {
		this.btn=this.props.button||"button";
	}
	,componentDidMount:function() {
		this.filterSeg(this.props.regex);
	}
	,filterSeg:function(tofind) {
		var regex=new RegExp( tofind,"g");
		var hits={};

		for (var id in this.state.texts) {
			this.state.texts[id].replace(regex,function(m){
				var idx=arguments[arguments.length-2];
				if (!hits[id]) hits[id]=[];
				hits[id].push( [idx,m.length]);
			});
		}
		setTimeout(function(){
			this.setState({match:Object.keys(hits), hits:hits, regex:tofind});
			this.goSeg(0);
		}.bind(this),100);
	}
	,goSeg:function(idx) {
		var segname=this.state.match[idx];
		this.setState({itemindex:idx});
		this.refs.match.getDOMNode().selectedIndex=idx;
		this.props.onGoSegment&&this.props.onGoSegment(segname,this.state.hits[segname],this.state.regex);
	}
	,next:function(){
		var itemindex=this.state.itemindex;
		if (itemindex<this.state.match.length-1) itemindex++;
		this.goSeg(itemindex);
	}
	,onKeyPress:function(e) {
		if (e.key=="Enter") {
			this.filterSeg(e.target.value);
		}
	}
	,onSelectItem:function(e) {
		this.goSeg(e.target.selectedIndex);
	}
	,onChange:function(e) {
		var regex=e.target.value;
		clearTimeout(this.timer);
		this.timer=setTimeout(function(){
			this.filterSeg(regex);
		}.bind(this),3000);
	}
	,renderItem:function(item,idx) {
		return E("option",null, item);
	}
	,renderMatch:function() {
			return E("select",{onChange:this.onSelectItem,style:this.props.style,ref:"match"}
				,this.state.match.map(this.renderItem));
	}
	,render : function() {
		return E("span",{}
			,E("input",{size:6,style:this.props.style,
					ref:"regex",defaultValue:this.state.regex,onKeyPress:this.onKeyPress,onChange:this.onChange})
			,this.renderMatch()
			,E(this.btn,{style:this.props.style,onClick:this.next},"↓")
		);
	}
})
module.exports=SegFilter;