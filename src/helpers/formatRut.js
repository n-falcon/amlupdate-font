var formatRut = {
	clean: function( value ) {
			if ( typeof _value !== 'string' ) {
				value = value.toString();
			}
			return value.replace( /^0+|[^0-9kK]+/g, '' ).toUpperCase().substring( 0, 10 );
		},
	format: function( _value, _default ) {
    if(!_value || _value == '') return
			_value = this.clean( _value );

			if ( !_value ) {
				return _default || '';
			}

			if ( _value.length <= 1 ) {
				return _value;
			}

			var result = _value.slice( -4, -1 ) + '-' + _value.substr( _value.length - 1 );
			for ( var i = 4; i < _value.length; i += 3 ) {
				result = _value.slice( -3 - i, -i ) + '.' + result;
			}
			return result;
		},
	validate: function (_rut) {
    if (typeof (_rut) !== 'string') {
      return false;
    }
    let cRut = _rut.replace(/[\.-]/g, '');
    let cDv = cRut.charAt(cRut.length - 1).toUpperCase();
    let nRut = parseInt(cRut.substr(0, cRut.length - 1));
    if (isNaN(nRut)) {
      return false;
    }
    var sum = 0;
    var factor = 2;
    nRut = nRut.toString();
    for (var i = nRut.length - 1; i >= 0; i--) {
      sum = sum + nRut.charAt(i) * factor;
      factor = (factor + 1) % 8 || 2;
    }
    var computedDv = 0;

    switch (sum % 11) {
      case 1:
        computedDv = 'k';
        break;
      case 0:
        computedDv = 0;
        break;
      default:
        computedDv = 11 - (sum % 11);
        break;
    }
    return computedDv.toString().toUpperCase() === cDv.toString().toUpperCase();
  },
	message: 'Este RUT es inválido'
};

export default formatRut;