
import * as _ from 'lodash';
import * as lodash_deep from 'lodash-deep';

_.mixin(lodash_deep);

export default function validator(doc, ...fields) {
	return fields.every(function(field) {
		return _.deepHas(doc._doc, field) && !!_.deepGet(doc._doc, field);
	});
}
