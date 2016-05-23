'use strict';

let COLOR = {
	MAIN: '#00ffad',
	RED: '#FD5200',
	BACKGROUND: '#1F2024',
	BORDER: '#2B2E34',
	MEDIUMBORDER: '#32343A',
	LIGHTBORDER: '#5D6068',
	LIGHTTEXT: '#636770',
	DARKTEXT: '#1F2024',
}

let FONT = {
	android : 'Roboto',
	ios : 'Avenir Next'
};


let STYLES = {
	container: {
		flex: 1,
		backgroundColor: COLOR.BACKGROUND
	},
	smallTitle: {
		color:COLOR.LIGHTTEXT,
  	fontSize:12,
  	fontFamily:FONT.ios,
		fontWeight : '600',
  	letterSpacing: 1,
  	paddingVertical:10
	}
}

module.exports = {
	COLOR,
	FONT,
	STYLES
};
