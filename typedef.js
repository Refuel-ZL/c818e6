function typedef(){
	var actionType={
		MODIFY_PASSWORD:0,
		MODIFY_IPADDRESS:1,
		MODIFY_SPORT:2,
		LOAD_PASSWORD:3,
		LOAD_IPADDRESS:4,
		LOAD_SPORT:5
	};
	return actionType;
}

if(exports){
	exports.typedef=typedef;
}
