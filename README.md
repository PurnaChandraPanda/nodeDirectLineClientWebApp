# nodeDirectLineClientWebApp
Node.js app that would act as DirectLine client to bot service app.


##  Steps to build the Node.js app
1. Go to your folder
2. Clone the repo [https://github.com/PurnaChandraPanda/nodeDirectLineClientWebApp.git]
3. Open the folder in VS Code (or some other editor)
4. Restore the npm packages [npm install]

## Steps to run the Node.js app
5. Run the app as:
	a)
	http://localhost:5000/dlClient
	
	This web page utilizes "botframework-directlinejs" package for DirectLine related communication. There would be a slight delay in reading response, and is implement as a kind of callback.
	
		app.post('/submit-data-dl', function(req, res){
			var query = req.body.inputQuery;

			// create a DirectLine object with secret
			var connector = new directLine.DirectLine({
				secret: 'your-drectline-secret-key'
			});

			// post activities to the bot
			connector.postActivity({
				from: {id: 'myUserId', name: 'myUserName'},
				type: 'message',
				text: query
			}).subscribe(
				id => console.log("Posted activity, assigned ID: ", id),
				error => console.log("Error posting activity:  ", error)
			);

			// listen to received message actvities
			connector.activity$
				.filter(activity => activity.type === 'message' && activity.from.id === 'ipaddrchkbot')
				.subscribe(
					//message => console.log("received message ", JSON.stringify(message))
					message => {
						console.log("received message ", message.text);
					}
				);
			
			res.send(query + ' - submitted successfully!');
		});
		
	b)
	http://localhost:5000/webchatClient
	
	This web page utilizes the latest v4 [WebChat] UI for DirectLine related conversation.

    ```	
	  <head>
	      <style>
		  html, body { height: 100% }
		  body { margin: 0 }
		  #webchat,
		  #webchat > * {
		    height: 80%;
		    width: 60%;
		  }
		</style>
		<script src="https://cdn.botframework.com/botframework-webchat/latest/webchat.js"></script>
		<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
	  </head>
	  <body>
	    <div id="webchat" role="main"></div>
	    <div id="backdiv">
	      <span>Your input messages can be seen here: </span>
	      <br/>
	      <textarea id="inputTextArea" style="width: 25%" rows="5"></textarea>
	    </div>

	    <script>
	      window.WebChat.renderWebChat({
		directLine: window.WebChat.createDirectLine({ secret: 'DL-secret-key' }),
		userID: 'myUserId'
	      }, document.getElementById('webchat'));

	      // Add on keypress listener to text input
	      // and wait for the user to hit the `enter` key
	      $("input[aria-label='Type your message']").on('keypress', event => {
		 // Check if user pressed `enter`
		 if (event.which === 13){
		   var inputMessage = $("input[aria-label='Type your message']").val();
		   //console.log(inputMessage);
		   $("textarea[id='inputTextArea']").append(inputMessage + '\n');
		 }
	      });
	    </script>    
	  </body>
	 ```	
  And, the "webchat" app is invoked from Node.js side by following:
  ```
  var app = express();
  app.use(bodyParser.urlencoded({extended: false}));
  ..
  app.get('/webchatClient', function (req, res) {
    res.sendFile('simplewebchat.html', {root: __dirname});
  });
  ```

### Note
For "WebChat" integration in Node.js and ASP.NET framework, our product team put together a great blog at https://blog.botframework.com/2018/09/01/using-webchat-with-azure-bot-services-authentication/. If you know how to work with routes in Node.js, it is easy to follow for next steps. The one I shared is plain vanilla app. For complex enterprise app, you should follow the later shared blog with depth work.

