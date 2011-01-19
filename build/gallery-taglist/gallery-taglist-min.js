YUI.add("gallery-taglist",function(a){var k=a.ClassNameManager.getClassName,d=a.Node.create,i="taglist",o=",",v=8,h=13,m=188,j=32,c="taglistentry",l=k("helper","clearfix"),n=k("icon"),w=k("icon","close"),e=k("icon","edit"),r=k(c,"holder"),p=k(c,"close"),x=k(c,"edit"),u=k(c,"text"),b=k(c,"item"),t=k(i,"input","container"),g='<span class="'+[n,w,p].join(" ")+'">Remove</span>',s='<span class="'+[n,e,x].join(" ")+'">Edit</span>',q='<span class="'+u+'"></span>',f='<ul class="'+[l,r].join(" ")+'"></ul>',y='<li class="'+t+'"></li>';a[i]=a.Base.create(i,a.Plugin.Base,[],{oldInput:null,inputContainer:d(y),input:d("<input>"),cont:d(f),lis:[],entries:[],span:d("<em></em>"),toString:function(){return"[Object "+i+"]";},initializer:function(){this.oldInput=this.get("host");this.entries=[];this.lis=[];this._selected=-1;this.renderUI();this.bindUI();this.syncUI();},destructor:function(){this.oldInput.set("type","text");this.input.remove();},renderUI:function(){this.inputContainer.appendChild(this.input);this.cont.appendChild(this.inputContainer);this.cont.appendChild(this.span);this.span.setStyles({visibility:"hidden",position:"absolute",top:"0",left:"0"});this.oldInput.set("type","hidden");this.input.set("value",this.oldInput.get("value"));this.oldInput.get("parentNode").appendChild(this.cont);},bindUI:function(){this.cont.delegate("click",this.removeClick,"span."+p,this);this.cont.delegate("click",this.editClick,"span."+x,this);this.input.on("blur",this.add,this);this.cont.on("click",function(){this.checkWidth();this.input.focus();},this);a.on("key",this.keyDown,this.input,"down:"+[h,v,m,j].join(","),this);this.input.on("keyup",this.checkWidth,this);},syncUI:function(){this.add();},_add:function(B){var C=(this.entries.length)?this.oldInput.get("value")+o+B:B,A=d('<li class="'+b+'"></li>'),z=d(q);A.appendChild(z.set("innerHTML",B));A.appendChild(d(s));A.appendChild(d(g));this.oldInput.set("value",C);this.cont.insert(A,this.inputContainer,"before");this.entries.push(B);this.lis.push(A);},add:function(){var B=this.input.get("value"),A,C,z;B=B.replace(/, /g,",");if(B.length){A=B.split(",");for(z=0,C=A.length;z<C;z+=1){this._add(A[z]);}this.input.set("value","");}this.cont.appendChild(this.inputContainer);this.input.focus();this.checkWidth();},_getIndex:function(A,B){var z,C=A.length;if(Array.prototype.hasOwnProperty("indexOf")){return A.indexOf(B);}else{for(z=0;z<C;z+=1){if(A[z]===B){return z;}}return -1;}},remove:function(A){var z=this.entries[A],B=(A)?o+z:z;if(z){this.oldInput.set("value",this.oldInput.get("value").replace(B,""));this.lis[A].remove();this.entries.splice(A,1);this.lis.splice(A,1);}this.input.focus();this.checkWidth();},removeClick:function(B){var A=B.target,z=this._getIndex(this.lis,A.get("parentNode"));if(z>-1){this.remove(z);}},edit:function(A){var z=this.entries[A];if(z){this.cont.insert(this.inputContainer,this.lis[A],"before");this.input.set("value",z);this.remove(A);}},editClick:function(B){var A=B.target,z=this._getIndex(this.lis,A.get("parentNode"));if(z>-1){this.edit(z);}},checkWidth:function(){var z=this.input.get("value");this.span.set("innerHTML",z);this.input.setStyle("width",(this.span.get("offsetWidth")+30)+"px");},keyDown:function(B){var C=B.keyCode,A=this.input.get("value"),z=this.entries.length;if(!A){if(C===h){return;}if(C===j){B.halt();}if(C===v&&z){B.halt();this.edit(z-1);}}if(C===h||C===m){B.halt();if(A){this.add();}}}},{NS:i,ATTRS:{}});},"@VERSION@",{requires:["base-build","plugin","node","classnamemanager","event"]});