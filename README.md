# 🤖 AI Assistant — React.js AI Chatbot

> **A modern, responsive AI chatbot built with React.js, Vite, Tailwind CSS, Groq API, and Markdown rendering.**

A clean and interactive **AI Chatbot** developed using **React.js + Vite**, integrated with the **Groq API** for AI-generated responses.

The chatbot provides a conversational interface where users can enter prompts, send them to an LLM through the Groq API, and receive beautifully formatted AI responses instead of plain/raw text.

---

## ✨ Project Caption

🚀 **Built my own AI Assistant using React.js!**

This project helped me understand how a React frontend can communicate with an LLM API, manage asynchronous API requests, handle loading and error states, securely manage environment variables, and render AI-generated Markdown responses in a user-friendly format.

One of the most interesting challenges was transforming the raw Markdown response from the LLM into a beautiful, readable interface with **headings, bold text, lists, tables, and proper formatting** — similar to modern AI applications.

To solve this, I integrated **React Markdown** with **remark-gfm**, making the AI responses much more readable and visually structured.

---

# 🧠 What I Built

This project is a frontend-based AI chatbot that combines:

* ⚛️ React.js
* ⚡ Vite
* 🎨 Tailwind CSS
* 🤖 Groq API
* 📝 React Markdown
* 🔧 remark-gfm
* 🔐 Environment Variables
* 🌐 JavaScript Fetch API
* 🔄 React State Management
* ⏳ Loading & Error Handling
* 📱 Responsive UI

---

# 🏗️ React.js Structure

The main application is contained inside the:

```text
ChatBotAI.jsx
```

React allows the UI to be divided into reusable **components**.

In this project:

```jsx
const ChatBotAI = () => {
    // State
    // Functions
    // API logic
    // UI
}

export default ChatBotAI;
```

`ChatBotAI` is the main React functional component.

It contains:

1. State management
2. API communication
3. User input handling
4. Loading management
5. Error handling
6. AI response processing
7. Markdown rendering
8. Complete chatbot UI

---

# ⚛️ React State Management

The chatbot uses React's `useState` hook:

```jsx
const [prompt, setPrompt] = useState("");
const [userMessage, setUserMessage] = useState("");
const [response, setResponse] = useState("");
const [loading, setLoading] = useState(false);
```

Each state has a specific responsibility.

### `prompt`

Stores the text currently being typed by the user.

```jsx
const [prompt, setPrompt] = useState("");
```

The input is controlled by React:

```jsx
value={prompt}
onChange={(event) => setPrompt(event.target.value)}
```

---

### `userMessage`

Stores the prompt after the user submits it.

```jsx
setUserMessage(submittedPrompt);
```

This allows the submitted question to immediately appear inside the chatbot UI.

---

### `response`

Stores the AI-generated response:

```jsx
setResponse(
    data.choices?.[0]?.message?.content || "No response received."
);
```

The response is then displayed using `ReactMarkdown`.

---

### `loading`

Controls the loading/Thinking state:

```jsx
setLoading(true);
```

While the API request is running, the UI displays:

```text
● ● ●  Thinking...
```

After the request finishes:

```jsx
setLoading(false);
```

---

# 🔄 How the Chatbot Works

The complete flow is:

```text
User enters prompt
        ↓
React stores prompt in state
        ↓
User submits form
        ↓
submittedPrompt stores current prompt
        ↓
User message appears immediately
        ↓
Loading state becomes true
        ↓
Fetch sends POST request
        ↓
Groq API receives the prompt
        ↓
LLM generates response
        ↓
Response comes back as JSON
        ↓
AI content is extracted
        ↓
ReactMarkdown renders Markdown
        ↓
Beautiful formatted response appears
        ↓
Loading state becomes false
```

---

# 📨 Form Submission

The chatbot uses:

```jsx
<form onSubmit={askAI}>
```

When the user submits the form, the `askAI()` function runs.

The first step is:

```jsx
event.preventDefault();
```

This prevents the browser from refreshing the page.

---

# 🛡️ Empty Prompt Validation

Before making an API request:

```jsx
if (!prompt.trim()) return;
```

`.trim()` removes unnecessary spaces.

Therefore, if the user submits an empty input such as:

```text
"     "
```

the API request will not be sent.

This avoids unnecessary API calls.

---

# 💾 Preserving the Submitted Prompt

The current prompt is saved:

```jsx
const submittedPrompt = prompt;
```

Then the UI is updated:

```jsx
setUserMessage(submittedPrompt);
setPrompt("");
```

This creates a better user experience because:

* The submitted message immediately appears.
* The input field becomes empty.
* The original submitted value remains available for the API request.

---

# 🤖 Groq API Integration

The chatbot communicates with the Groq API using JavaScript's native `fetch()` method.

```jsx
const res = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
        method: "POST",
        ...
    }
);
```

The request uses:

```text
POST
```

because data is being sent to the API.

---

# 🔐 Environment Variable

The API key is stored inside a `.env` file instead of directly writing it into the source code.

Example:

```env
VITE_GROQ_API_KEY=your_api_key_here
```

Inside React:

```jsx
const apiKey = import.meta.env.VITE_GROQ_API_KEY;
```

Then the Authorization value is created:

```jsx
const authorization = `Bearer ${apiKey}`;
```

And passed into the request:

```jsx
headers: {
    "Content-Type": "application/json",
    Authorization: authorization,
}
```

This keeps the API key out of the GitHub repository when `.env` is included in `.gitignore`.

### `.gitignore`

```gitignore
.env
```

> ⚠️ **Important:** A Vite `VITE_*` environment variable is available to client-side code. Therefore, `.env` prevents the key from being committed to GitHub, but it does **not** make the API key secret from users of the deployed frontend. For a production application, the API request should normally be moved to a backend/server-side environment where the API key remains private.

---

# 📦 API Request Body

The chatbot sends:

```jsx
body: JSON.stringify({
    model: "openai/gpt-oss-20b",
    messages: [
        {
            role: "user",
            content: submittedPrompt,
        },
    ],
})
```

The important parts are:

### Model

```jsx
model: "openai/gpt-oss-20b"
```

This tells the API which model should process the request.

### Messages

```jsx
messages: [
    {
        role: "user",
        content: submittedPrompt,
    },
]
```

The user's prompt is sent as the content of a user message.

---

# 📥 Receiving the API Response

After the request:

```jsx
const data = await res.json();
```

The JSON response is converted into a JavaScript object.

The chatbot then checks:

```jsx
if (!res.ok) {
    throw new Error(
        data.error?.message || "Groq API request failed"
    );
}
```

This allows API errors to be handled properly.

---

# 🔎 Extracting the AI Response

The actual AI-generated text is extracted using:

```jsx
data.choices?.[0]?.message?.content
```

Conceptually:

```text
data
 └── choices
      └── [0]
           └── message
                └── content
                     └── AI response
```

The optional chaining operator `?.` prevents JavaScript from immediately throwing an error if an intermediate property does not exist.

A fallback is also provided:

```jsx
"No response received."
```

---

# 🚨 Error Handling

The API request is wrapped inside:

```jsx
try {
    ...
} catch (error) {
    ...
} finally {
    ...
}
```

### `try`

Runs the API request.

### `catch`

Handles errors:

```jsx
catch (error) {
    console.error(error);
    setResponse(error.message || "Error while connecting!");
}
```

### `finally`

Runs whether the request succeeds or fails:

```jsx
finally {
    setLoading(false);
}
```

This guarantees that the loading state is reset.

---

# ⏳ Loading Experience

While the AI is processing the request:

```jsx
{loading && (
    ...
)}
```

the chatbot displays an animated:

```text
● ● ● Thinking...
```

This gives the user visual feedback that the API request is still running.

The input and button are also disabled:

```jsx
disabled={loading}
```

and:

```jsx
disabled={loading || !prompt.trim()}
```

This prevents unnecessary multiple submissions while the AI is responding.

---

# 🧩 Challenges Faced & Solutions

Building this AI chatbot was not only about connecting an API and displaying a response. During development, I faced several practical challenges that helped me understand how React state management, API responses, Markdown rendering, and environment variables work together in a real-world application.

---

## 1️⃣ Challenge: Converting Raw AI Response into Beautifully Formatted Text

### 🧩 The Problem

Initially, the AI response was displayed directly as normal text.

However, LLMs often return responses containing Markdown syntax such as:

* Headings
* **Bold text**
* Numbered lists
* Bullet points
* Tables
* Structured paragraphs

Displaying this response directly using a normal JSX element does not provide the polished reading experience users expect from modern AI applications.

For example, an AI response could contain:

```markdown
# JavaScript

JavaScript is a **programming language**.

## Features

- Dynamic
- Flexible
- Widely used
```

Without Markdown rendering, the user may see the Markdown syntax itself instead of properly formatted headings, bold text, and lists.

### 💡 The Solution

I integrated two third-party libraries:

```bash
npm install react-markdown remark-gfm
```

Then I used:

```jsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
```

The response is rendered through:

```jsx
<ReactMarkdown remarkPlugins={[remarkGfm]}>
    {response}
</ReactMarkdown>
```

I also customized Markdown elements such as:

* `h1`
* `h2`
* `h3`
* `strong`
* `ul`
* `ol`
* `table`
* `th`
* `td`
* `code`

This allowed the chatbot to transform the raw Markdown generated by the LLM into a much more readable and visually structured interface.

### 🎯 What I Learned

I learned that receiving an AI response is only one part of an AI application.

The frontend also needs to **process and present the response in a user-friendly format**.

```text
LLM Response
     ↓
Markdown
     ↓
ReactMarkdown
     ↓
Styled React Elements
     ↓
Beautiful AI Response
```

---

## 2️⃣ Challenge: Clearing the Input Immediately After Submission

### 🧩 The Problem

Another important challenge appeared in the chatbot's input area.

Initially, when the user entered a prompt and clicked the **Submit** button:

```text
User enters prompt
        ↓
Submit
        ↓
AI response appears
```

The submitted prompt was successfully sent to the API and displayed inside the user chat bubble.

However, the same prompt **remained inside the input field**.

This was not the desired user experience.

A good chatbot should immediately clear the input field after submission so the user can start typing the next prompt.

### 🔍 Why Was This Happening?

The input field was controlled by React state:

```jsx
const [prompt, setPrompt] = useState("");
```

and:

```jsx
<input
    value={prompt}
    onChange={(event) => setPrompt(event.target.value)}
/>
```

Therefore, the input displays whatever value currently exists inside `prompt`.

Initially, I was clearing the input only after the API request completed:

```jsx
setPrompt("");
```

But this meant that the input remained populated while the API request was processing.

### 💡 The Solution

I introduced a separate state for the submitted user message:

```jsx
const [userMessage, setUserMessage] = useState("");
```

Then, before starting the API request, I first preserved the submitted prompt:

```jsx
const submittedPrompt = prompt;
```

Then I immediately updated the UI:

```jsx
setUserMessage(submittedPrompt);
setPrompt("");
setLoading(true);
setResponse("");
```

This created a clear separation between:

### `prompt`

The text currently present inside the input field.

### `submittedPrompt`

The prompt that the user has just submitted and that needs to be sent to the API.

### `userMessage`

The submitted prompt that should remain visible in the chat interface.

---

### 🔄 New Flow

The improved flow became:

```text
User types prompt
       ↓
prompt state stores it
       ↓
User clicks Submit
       ↓
submittedPrompt = prompt
       ↓
setUserMessage(submittedPrompt)
       ↓
setPrompt("")
       ↓
Input becomes empty immediately
       ↓
setLoading(true)
       ↓
API request uses submittedPrompt
       ↓
AI response arrives
       ↓
Response displayed
```

The API request therefore uses:

```jsx
content: submittedPrompt
```

instead of depending on the input state after it has been cleared.

### 🎯 What I Learned

This challenge gave me a practical understanding of **React state separation and UI timing**.

The important idea was:

> The value needed for the API request and the value needed for the UI do not always have to come from the same state.

By preserving the submitted prompt in:

```jsx
const submittedPrompt = prompt;
```

I could:

1. Keep the submitted message available for the API.
2. Display it in the chat bubble.
3. Clear the input immediately.
4. Start the loading state immediately.

This made the chatbot feel much more responsive.

---

## 3️⃣ Challenge: Uploading a Vite + React AI Project to GitHub Without Exposing the API Key

### 🧩 The Problem

The chatbot requires an API key to communicate with the Groq API.

The key was stored in a `.env` file:

```env
VITE_GROQ_API_KEY=your_api_key
```

Since the project was going to be uploaded to GitHub, I needed to make sure that the API key was **not accidentally committed to the repository**.

I initially wondered whether I needed to install the `dotenv` package separately.

### 💡 The Solution

While working with Vite, I learned that **Vite has built-in support for `.env` files**.

Therefore, for this frontend setup, I did not need to install the `dotenv` package just to read the environment variable.

The API key can be accessed through:

```jsx
const apiKey = import.meta.env.VITE_GROQ_API_KEY;
```

The important part is the `VITE_` prefix because Vite exposes client-side environment variables with that prefix to the application.

---

### 🔐 Protecting `.env` from GitHub

The next step was adding `.env` to the project's `.gitignore` file:

```gitignore
.env
```

The Vite-generated `.gitignore` already contains several files and directories that should not be committed.

I added:

```gitignore
.env
```

This tells Git to ignore the `.env` file.

As a result:

```text
Project
│
├── .env              ← Local only ❌ GitHub
├── .gitignore
├── src/
├── public/
└── package.json
```

When checking:

```bash
git status
```

the `.env` file was not listed under untracked files.

This confirmed that Git was ignoring it.

### 🎯 What I Learned

I learned that:

```text
.env
   ↓
.gitignore
   ↓
Git ignores the file
   ↓
API key is not committed to GitHub
```

I also learned that **`.env` is not a package**.

It is an environment-variable configuration file supported by Vite.

Therefore, installing:

```bash
npm install dotenv
```

was not necessary for this particular Vite frontend setup.

---

### ⚠️ Important Security Understanding

Ignoring `.env` prevents the API key from being accidentally uploaded to GitHub, but it does **not** make a `VITE_*` API key truly secret in a deployed frontend application.

Because the React application runs in the user's browser:

```text
React/Vite Frontend
       ↓
Browser
       ↓
VITE_GROQ_API_KEY
       ↓
Groq API
```

the key can potentially be inspected by users.

For a production application, a safer architecture is:

```text
React Frontend
       ↓
Your Backend
       ↓
Private API Key
       ↓
Groq API
```

This keeps the actual API key on the server instead of exposing it to the browser.

---

# 🏆 Overall Learning From These Challenges

These challenges helped me understand that building an AI application involves much more than simply calling an LLM API.

I learned how different parts of the application work together:

```text
React Component
      ↓
State Management
      ↓
User Input
      ↓
API Request
      ↓
LLM Response
      ↓
Response Processing
      ↓
Markdown Rendering
      ↓
Beautiful Chat UI
```

At the same time, Git and environment-variable management added another important layer:

```text
API Key
   ↓
.env
   ↓
.gitignore
   ↓
Git
   ↓
GitHub
```

These practical challenges helped me understand how a simple React project can evolve into a more complete **AI-powered application** while also teaching me important lessons about frontend architecture, user experience, API integration, and source-code security.


# 🎯 Main Functionalities

## 1. User Prompt Input

The user can enter a question through the input field.

---

## 2. Controlled React Input

The input is connected to React state:

```jsx
value={prompt}
onChange={(event) => setPrompt(event.target.value)}
```

---

## 3. API Integration

The application sends the prompt to the Groq API using `fetch()`.

---

## 4. AI Response

The generated response is extracted from the API response and stored in React state.

---

## 5. Markdown Rendering

AI-generated Markdown is transformed into properly formatted UI using:

```text
React Markdown
+
remark-gfm
```

---

## 6. Loading State

The chatbot displays a "Thinking..." animation while waiting for the API.

---

## 7. Error Handling

API errors are caught and displayed to the user.

---

## 8. Responsive Design

The interface uses Tailwind CSS responsive utilities such as:

```text
sm:
```

to adapt the chatbot interface to different screen sizes.

---

## 9. Modern Chat Interface

The UI includes:

* 🤖 AI avatar
* 👤 User avatar
* 💬 Chat bubbles
* ✨ Gradient header
* ⏳ Animated loading indicator
* 📱 Responsive layout
* 📝 Formatted AI responses
* 🔘 Interactive send button

---

# 🎨 UI Architecture

The interface can be understood as four major sections:

```text
┌──────────────────────────────┐
│        🤖 Header             │
│        AI Assistant          │
├──────────────────────────────┤
│                              │
│  🤖 Welcome Message          │
│                              │
│              User Message 👤 │
│                              │
│  🤖 AI Response              │
│                              │
├──────────────────────────────┤
│  👤  Ask anything...    ➤    │
│                              │
│  AI can make mistakes...     │
└──────────────────────────────┘
```

---

# 🛠️ Technologies Used

| Technology     | Purpose                                      |
| -------------- | -------------------------------------------- |
| React.js       | Building the UI and managing component state |
| Vite           | Development server and frontend build tool   |
| Tailwind CSS   | Styling and responsive UI                    |
| Groq API       | Connecting the application with an LLM       |
| Fetch API      | Sending HTTP requests                        |
| React Markdown | Rendering Markdown responses                 |
| remark-gfm     | Supporting GitHub Flavored Markdown          |
| JavaScript     | Application logic                            |

---

# 📁 Project Structure

A simplified structure of the project:

```text
smartPro-ChatBot/
│
├── public/
│
├── src/
│   ├── components/
│   │
│   ├── ChatBotAI.jsx
│   │
│   └── ...
│
├── .env
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

> The `.env` file should remain local and should not be committed to GitHub.

---

# 🚀 Installation & Setup

Clone the repository and install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a `.env` file in the project root:

```env
VITE_GROQ_API_KEY=your_groq_api_key
```

Then start the application.

---

# 📦 Important Dependencies

The Markdown functionality was implemented using:

```bash
npm install react-markdown remark-gfm
```

These packages are responsible for converting AI-generated Markdown into properly structured React UI.

---

# 🔐 Security Note

For learning and portfolio purposes, this project demonstrates environment-variable usage with Vite.

However, an important distinction should be understood:

```text
.env
   ↓
Prevents accidental GitHub exposure
```

but:

```text
VITE_GROQ_API_KEY
   ↓
React/Vite frontend
   ↓
Browser
```

means the key can potentially be exposed to users because Vite client-side environment variables are included in the frontend application.

### Recommended production architecture

```text
React Frontend
      ↓
Your Backend API
      ↓
Private Environment Variable
      ↓
Groq API
```

The backend should hold the API key and communicate with Groq.

---

# 📚 What I Learned From This Project

This project helped me practice several important concepts:

* React functional components
* `useState`
* Controlled inputs
* Form submission
* `async/await`
* `try/catch/finally`
* JavaScript `fetch()`
* HTTP POST requests
* Request headers
* JSON request bodies
* API response handling
* Optional chaining
* Environment variables
* `.gitignore`
* LLM API integration
* Markdown rendering
* GitHub Flavored Markdown
* Conditional rendering
* Loading states
* Error states
* Tailwind CSS
* Responsive UI development

Most importantly, it helped connect the concepts of:

```text
Frontend
   +
React State
   +
API
   +
LLM
   +
Response Processing
   +
Markdown Rendering
   =
AI Application
```

---

# 🌟 Final Takeaway

This project is more than just a chatbot UI.

It demonstrates how a React application can communicate with an LLM, manage asynchronous operations, process structured API responses, and transform AI-generated Markdown into a polished conversational interface.

The Markdown-rendering challenge was especially valuable because it demonstrated an important real-world development lesson:

> **The AI response is not always ready to be displayed directly. The frontend often needs to process and present that response in a user-friendly way.**

That is what turned the basic API chatbot into a more complete **AI-powered React application**. 🚀🤖

---

## 🔗 Official References

* React — [React Documentation](https://react.dev/?utm_source=chatgpt.com)
* Vite — [Vite Documentation](https://vite.dev/?utm_source=chatgpt.com)
* React Markdown — [React Markdown on GitHub](https://github.com/remarkjs/react-markdown?utm_source=chatgpt.com)
* remark-gfm — [remark-gfm on GitHub](https://github.com/remarkjs/remark-gfm?utm_source=chatgpt.com)
* Groq API — [Groq Documentation](https://console.groq.com/docs?utm_source=chatgpt.com)

---

## 🏷️ Hashtags

#ReactJS #GenerativeAI #AIChatbot #Groq #Vite #JavaScript #WebDevelopment



