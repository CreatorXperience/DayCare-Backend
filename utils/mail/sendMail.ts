import nodemailer from "nodemailer"
import handlebars from "handlebars"

type TMailPayload =  {
    title: string,
    desc: string,
    details?: string,
    link: string,
    to: string,
    name: string
}
const sendMail = async (email: string, template: TMailPayload)=>{
    let transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {user: process.env.EMAIL, pass: process.env.EMAIL_PASS},
    })

    let file = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.cdnfonts.com/css/poppins" rel="stylesheet">
                
  <title>Document</title>
  <style>
    *{
      font-family: Poppins;
    }
    body,html {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .container {
      width: 30%;
      height: auto;
      background-color: white;
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.10);
      border-radius: 20px;
      position: relative;
      padding: 12px;
    }
    .name {
      font-display: capitalize;
      font-size: 14px;
      position: absolute;
      bottom: 0px;
      right: 5px;
      margin-top: px;
    }
    .image {
      width: 200px;
      height: 200px;
      background-image: url("{{link}}");
      background-size: cover;
      margin: 0 auto;
    }

    h1{
      text-align: center;
    }

    p{
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="name">Designed by: Daycare app</div>
    <div class="image"></div>
    <div class="message">
      <h1>{{title}}</h1>
      <p>{{message}}</p>
      <p>Subject: Welcome to [Daycare Name]! </p>

     <h3> Hi ,{{recipient}} </h3>
      
      <p> Welcome to {{name}} We're excited to have your child with us. Feel free to reach out with any questions.
      
      Best regards, </p>

      <p>Daycare app</p>
    </div>
  </div>
</body>
</html>`

let compile = handlebars.compile(file)
const replacement = {
    title: template.title,
    message: `${template.desc}`,
    link: template.link,
    recipient: template.to,
    name: template.name
}

let htmlFile = compile(replacement)
 if(process.env.NODE_ENV !== "test")
 transporter.sendMail({
    from: "allyearmustobey@gmail.com",
    to: email,
    subject: template.title,
    html: htmlFile
},(error, data)=>{
    if(error){
 return  console.log("error occured while send email")
    }
    console.log("sent successfully")
   return 
})
}

export default sendMail