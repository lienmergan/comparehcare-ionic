/**
 * Created by lienmergan on 14/05/16.
 */

var express = require('express'),
app = express();
app.use(express.static('app/www'));
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
