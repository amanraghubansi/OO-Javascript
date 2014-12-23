/*Globals to get json and slider parent elements*/
var firstslide=document.getElementById('first-slide-show'),
			secondslide=document.getElementById('second-slide-show'),
			catUrl="json/configCat.json",
			tigerUrl="json/configTiger.json";

/*Global function  to create elements*/
function createElements(){	
	return{
		/*create diiferent elements required in slider*/
		heading:document.createElement('h2'),
		docfrag:document.createDocumentFragment(),
		fig:document.createElement('figure'),
		image:document.createElement('img'),
		figcaption:document.createElement('figcaption'),
		nextbtn:document.createElement('button'),
		prevbtn:document.createElement('button')
	};
}





/*Call this function with arguments as element where you want to make slider and path to json file*/
function initSlideshow(element,url){
	this.element=element;
	this.url=url;
	
}

initSlideshow.prototype.makeAjaxCall = function(){
	var self=this;

	var xmlhttp;
	if(window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	}
	else{// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function(){
		if(xmlhttp.readyState==4 && xmlhttp.status==200){
			//console.log(self.element);
			/*callback function to be called after ajax response*/	
			
	   		self.addSlider(self.element,JSON.parse(xmlhttp.responseText));
	   		
	    }
	};
	xmlhttp.open("GET",this.url,true);
	xmlhttp.send();
};



/*Function got executed when ajax response comes successfully as this is callback function*/
initSlideshow.prototype.addSlider=function(element,responsedata	){
	var keydata=Object.keys(responsedata),	
    	obj=responsedata[keydata[1]],
    	len=obj.length;

	var generatedElements=new createElements();
	/*To set heading of slider*/
	generatedElements.heading.innerHTML+= responsedata[keydata[0]]; 
	element.appendChild(generatedElements.heading);

	/*create next and previous buttons*/
	generatedElements.prevbtn.innerHTML="Prev";
	generatedElements.nextbtn.innerHTML="Next";
	generatedElements.prevbtn.disabled=true;
	generatedElements.nextbtn.disabled=false;

	/*attach event handlers to buttons*/
	generatedElements.nextbtn.addEventListener('click',loadnext,true);
	generatedElements.prevbtn.addEventListener('click',loadprev,true);

	/*To show image and caption for first time*/
	var i=0;
	generatedElements.image.setAttribute('src',obj[i].path);
	generatedElements.figcaption.innerHTML=obj[i].caption;
	generatedElements.fig.appendChild(generatedElements.image);
	generatedElements.fig.appendChild(generatedElements.figcaption);
	
	/*Document fragment is created to avoid multiple DOM manipulations
	  and append document fragment at end to given slider div*/	
	generatedElements.docfrag.appendChild(generatedElements.fig);
	generatedElements.docfrag.appendChild(generatedElements.prevbtn);
	generatedElements.docfrag.appendChild(generatedElements.nextbtn);
	element.appendChild(generatedElements.docfrag);

	/*Click handlers for next and previous buttons:
	 -To load new image and caption on click of next/prev button.
	 -Disable button if next/prev image in slider does not exist.*/
	function loadnext(){
		i++;	
		generatedElements.image.setAttribute('src',obj[i].path);
		generatedElements.figcaption.innerHTML=obj[i].caption;
		if(checkStatus(i) == 'disable'){
			return;
		}
	}
	function loadprev(){
		i--;
		generatedElements.image.setAttribute('src',obj[i].path);
		generatedElements.figcaption.innerHTML=obj[i].caption;
		if(checkStatus(i) == 'disable'){
			return;
		}
	} 
	function checkStatus(x){
		if(x == len-2){
			generatedElements.nextbtn.disabled=true;
			return 'disable';
		}else if(x===0){
			generatedElements.prevbtn.disabled=true;
			return 'disable';
		}

		if(generatedElements.nextbtn.disabled){
			generatedElements.nextbtn.disabled=false;
		}
		if(generatedElements.prevbtn.disabled){
			generatedElements.prevbtn.disabled=false;
		}
	}
};


var obj1=new initSlideshow(firstslide,catUrl);
var obj2=new initSlideshow(secondslide,tigerUrl);

obj1.makeAjaxCall();
obj2.makeAjaxCall();
