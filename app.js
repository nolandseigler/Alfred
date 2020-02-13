// LIVE APP CODE HOSTED BY GLITCH:
//https://motley-power.glitch.me
const axios = require('axios');
// start the party by destructuring the App property of the bolt framework
const { App } = require('@slack/bolt');
//require our store that we have not made yet.
const store = require('../Integrated/glitch/store');
//instantiate the object app as a new App object. pass in an object with our private key for signing messages and our OAUTH bot token. we are using the environment variables to do this so we dont blast our keys/tokens to the world. Be sure to put .env in the .gitignore
const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN
});
const music = ["https://www.youtube.com/watch?v=2TvWZEVf6go", "https://www.youtube.com/watch?v=y7e-GC6oGhg", "https://www.youtube.com/watch?v=8c9yOlPVpak", "https://www.youtube.com/watch?v=TDcJJYY5sms"];
const randomMusic = () => music[Math.floor(Math.random() * music.length)];
const enterReplies = ["Welcome!", "Howdy!", "Hello friend.", "Gotcha", "Hello there.", "I see you"]
const leaveReplies = ['Goodbye', 'Adios', 'Uh oh']
const randomEnterReply = () => enterReplies[Math.floor(Math.random() * enterReplies.length)];
const randomLeaveReply = () => leaveReplies[Math.floor(Math.random() * leaveReplies.length)];
//
//
//
//
//uses the event api listener to trigger on the app_home_opened eventName. the function takes in the event then calls the function.
app.event('app_home_opened', ({ event, say }) => {
    // Look up the user from DB. This will work one day but today is not that day. An interesting note is that there seems to be some cache. I have not timed it but for a few mins/hours the system believes user is true. (click the app a bunch and watch). the app home functionality is not turned on and it is in beta. what is funny is that this still works for dms to the app.
    let user = store.getUser(event.user);

    if(!user) {
        user = {
            user: event.user,
            channel: event.channel
        };
        store.addUser(user);

        say(`Hello <@${event.user}>! I am Frankenstein's Monster. I am currently in development. Once I am functioning properly, I will earn a real name. This text will be an onboarding process to the app.`);
    } else {
        say(`This will post useful information. The current plan is to post a link to the codeup calendar and eventually have it post the daily schedule for class with a link to the lesson.`);
    }
});



// Start your app with async. Based on the watching a youtube vid from JSConf this allows the app to start but makes it wait outside of the stack within the web api, once the async timer expires it then goes to the queue where it waits for the stack to be clear before executing.
(async () => {
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running!');
})();




app.message("%frankensteinsMonster", ({ say }) => say("Romulus was the legendary founder and first king of Rome. Various traditions attribute the establishment of many of Rome's oldest legal, political, religious, and social institutions to Romulus and his contemporaries."));
app.command('/alfredhelp', async ({ command, ack, say }) => {
    // Acknowledge command request
    ack();

    say(`This is a blurb about blurbs. REPLACE THIS`);
});
app.message(/this is the (.*)/i, ({ say, context }) => {
    const mando = context.matches[1];
    const text = (mando === 'way') ?
        'This is the way.' :
        `We do not take Imperial Credits here`;

    say(text);
});

app.message('%squirrelThis', async ({ message, context }) => {
    try {
        await app.client.reactions.add({
            token: context.botToken,
            name: 'squirrel',
            channel: message.channel,
            timestamp: message.ts,
        });
    } catch (error) {
        console.error(error);
    }
});

// https://motley-power.glitch.me/slack/events
app.command('/randommusic', async ({ command, ack, say }) => {
    // Acknowledge command request
    ack();
    say(randomMusic());
});

app.command('/fullstack', async ({ command, ack, say }) => {
    // Acknowledge command request
    ack();

    say(`Codeup Web Development Curriculum: https://java.codeup.com/toc`);
});

app.command('/gmail', async ({ command, ack, say }) => {
    // Acknowledge command request
    ack();

    say(`Access Your Gmail: https://www.google.com/gmail/`);
});

app.command('/linkedin', async ({ command, ack, say }) => {
    // Acknowledge command request
    ack();

    say(`Access Your Linkedin: https://www.linkedin.com/`);
});

app.command('/codey', async ({ command, ack, say }) => {
    // Acknowledge command request
    ack();

    say(`{You told Codey:} '${command.text}' {Have you tried anything else?}`);
});

app.command('/rhymethis', async ({ command, ack, say }) => {
    // Acknowledge command request
    ack();
    // Information to reach API
    //works
    axios.get('https://api.datamuse.com/words?rel_rhy=' + command.text)
        .then(function (response) {
            let outputArr = [];
            let i = 0;
            while (i < 10 ) {
                outputArr.push(response.data[i]['word']);
                i++
            };
            let output = outputArr.join(', ');
            // let output = response.data[0]['word'];
            say(`The top ten words that rhyme with ${command.text} are: ${output}`);
        })
        .catch(function (error) {
            // handle error
            say('error');
        });
});
app.command('/giphy', async ({ command, ack,  say}) => {
    // Acknowledge command request
    ack();
    // Information to reach API
    //works
    axios.get('https://api.giphy.com/v1/gifs/search?api_key=' + process.env.GIPHY_KEY + '&q=' + command.text + '&limit=25&offset=0&rating=G&lang=en')
        .then(function (response) {
            let outputArr = [];
            let i = 0;
            while (i < 10 ) {
                outputArr.push(response.data['data'][i]['bitly_gif_url']);
                i++
            };
            let index = Math.ceil(Math.random() * 11);
            let output = outputArr[index];

            // let output = response.data[0]['word'];
            say(output);
        })
        .catch(function (error) {
            // handle error
            say('error');
        });
});

// https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=surfing&key=[YOUR_API_KEY]
app.command('/youtube', async ({ command, ack,  say}) => {
    // Acknowledge command request
    ack();
    // Information to reach API
    //&regionCode=US
    axios.get('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=' + command.text + '&regionCode=US' + '&key=' + process.env.YOUTUBE_KEY)
        .then(function (response) {
            // let res = response.data['items'][0]['id']['videoId'];

            let outputArr = [];
            let i = 0;
            while (i < 24 ) {
                outputArr.push(response.data['items'][i]['id']['videoId']);
                i++
            };
            let index = Math.ceil(Math.random() * 24);
            let output = outputArr[index];

            say(`https://www.youtube.com/watch?v=${output}`);
        })
        .catch(function (error) {
            // handle error
            say('error');
        });
});
app.event('member_joined_channel', ({ say }) => say(randomEnterReply()));
app.event('member_left_channel', ({ say }) => say(randomLeaveReply()));





