// import React, { useState } from "react";
// import {marked} from "marked";
// import "./styles.css";
// function Markdown() {
//     const [markdown, setMarkdown] = useState("");
//     const handleChange = (e) => {
//         setMarkdown(e.target.value);
//     };
//     const renderMarkdown = () => {
//         return { __html: marked(markdown) };
//     };
//     const handleSubmit = () => {
//         const blob = new Blob([markdown], { type: 'text/markdown' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'markdown-content.md'; // Filename
//     link.click();
//     URL.revokeObjectURL(url); // Clean up after the download is triggered
//     window.alert("Markdown file created! You can share it.");
//     };
// return (
//         <div>
//             <div className="img">
//         <div className="container">
//         <div className="text">
//         <h1>Markdown Previewer</h1>
//         </div>
//         <div className="row">
//             <div className="column">
//             <h2>Input</h2>
//             <textarea
//                 className="input"
//                 value={markdown}
//                 onChange={handleChange}
//             />
//             </div>
//             <div className="column">
//             <h2>Output</h2>
//             <div className="output" dangerouslySetInnerHTML={renderMarkdown()} />
//             </div>
//         </div>
//         <button type="submit" className="button" onClick={handleSubmit}>Submit</button>
//         </div>
//         </div>
//         </div>
//     )
// }

// export default Markdown










import React, { useState } from "react";
import { marked } from "marked";
import "./styles.css";

function Markdown() {
    const [markdown, setMarkdown] = useState("");
    const [shareableLink, setShareableLink] = useState("");

    const handleChange = (e) => {
        setMarkdown(e.target.value);
    };

    const renderMarkdown = () => {
        return { __html: marked(markdown) };
    };

    const handleSubmit = async () => {
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Markdown Card</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .card { border: 1px solid #ddd; padding: 20px; border-radius: 10px; background-color: #f9f9f9; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>Markdown Content</h1>
                <div id="markdown-content">${markdown}</div>
            </div>
        </body>
        </html>`;
    
        // API URL for creating a deploy
        const netlifyApiUrl = "https://api.netlify.com/api/v1/sites/YOUR_SITE_ID/deploys";
        
        // Prepare the request
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer YOUR_ACCESS_TOKEN`,
            },
            body: JSON.stringify({
                files: [
                    {
                        path: "/index.html", // the path where your HTML file will be stored
                        content: htmlContent,
                    },
                ],
            }),
        };
    
        try {
            const response = await fetch(netlifyApiUrl, options);
            const data = await response.json();
            if (response.ok) {
                // Get the deploy URL
                setShareableLink(data.deploy_url);
                window.alert("Deployment successful! You can share the link.");
            } else {
                window.alert("Deployment failed: " + data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            window.alert("An error occurred during deployment.");
        }
    };
    

    return (
        <div>
            <div className="img">
                <div className="container">
                    <div className="text">
                        <h1>Markdown Previewer</h1>
                    </div>
                    <div className="row">
                        <div className="column">
                            <h2>Input</h2>
                            <textarea
                                className="input"
                                value={markdown}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="column">
                            <h2>Output</h2>
                            <div className="output" dangerouslySetInnerHTML={renderMarkdown()} />
                        </div>
                    </div>
                    <button type="submit" className="button" onClick={handleSubmit}>
                        Submit
                    </button>
                    {shareableLink && (
                        <div>
                            <h3>Shareable Link:</h3>
                            <a href={shareableLink} target="_blank" rel="noopener noreferrer">
                                {shareableLink}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Markdown;
