/**
 * @author steveoni
 * parse Rss2.0 to a json doc
 * @param file name
 */
var fs = require('fs');

module.exports = function(file){
        var d = fs.readFileSync(file,'utf-8').toString();
        
        
        var c = d.match(/<(item)([^>]*)>(.*?)<\/\1>/g);//match out all the content inside the item flag
        
        var t = c[0].match(/(<(dc:(\w+))>)/g);//get the xml tag that contains element dc: e.g dc:date
        var t1 = c[0].match(/(<(\w+))>/g);//get other xml element like description,link e.t.c

        //since t1 will contain the item element itself so we remove it
        //all we need is , all the tag /element in the <item></item>
        t1.splice(0,1);

        var con = t1.concat(t);//concatenate the two elemnent in <item> into one array
        
        //join the element in the array e.g ['<title>','<dc:date>']
        //and remove the tags '<' and '>'
        var re = con.join(' ').match(/([^<])(\w+:*\w+)([^>])/g)

        //store the data gotten from the Rss
        var f = {};
        for(var i in c){//loop thru all the element in the <item> which has been converted to array
            f[i] = {};
            for(var j in re){
                // check if the i is an element
                //then get the content of such element
                //which is located at index 2 if using match()
                switch(re[j]){
                    case 'title':
                            f[i][re[j]] = c[i].match(/<(title)>(.+)<\/\1>/)[2];
                    break;
                    case 'link':
                            f[i][re[j]] = c[i].match(/<(link)>(.+)<\/\1>/)[2];
                    break;
                    case 'description':
                            f[i][re[j]] = c[i].match(/<(description)>(.+)<\/\1>/)[2];
                    break;
                    case 'dc:publisher':
                            f[i][re[j]] = c[i].match(/<(dc:publisher)>(.+)<\/\1>/)[2];
                    break;
                    case 'dc:date':
                            f[i][re[j]] = c[i].match(/<(dc:date)>(.+)<\/\1>/)[2];
                    break;
                    case 'dc:creator':
                            f[i][re[j]] = c[i].match(/<(dc:creator)>(.+)<\/\1>/)[2];
                    break;
                    
                }
                
            }
        }
        return f;
};



