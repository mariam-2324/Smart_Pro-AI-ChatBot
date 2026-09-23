import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatBotAI = () => {
	const [prompt, setPrompt] = useState("");
	const [userMessage, setUserMessage] = useState("");
	const [response, setResponse] = useState("");
	const [loading, setLoading] = useState(false);

	const askAI = async (event) => {
		event.preventDefault();

		if (!prompt.trim()) return;

		// User ke current prompt ko save kar lo
		const submittedPrompt = prompt;

		// UI ko immediately update karo
		setUserMessage(submittedPrompt);
		setPrompt("");
		setLoading(true);
		setResponse("");

		try {
			// 🔍 Check the API key and Authorization value
			const apiKey = import.meta.env.VITE_GROQ_API_KEY;
			const authorization = `Bearer ${apiKey}`;

			console.log("API KEY:", apiKey);
			console.log("Authorization:", authorization);

			const res = await fetch(
				"https://api.groq.com/openai/v1/chat/completions",
				{
					method: "POST",

					headers: {
						"Content-Type": "application/json",
						Authorization: authorization,
					},
					body: JSON.stringify({
						model: "openai/gpt-oss-20b",
						messages: [{ role: "user", content: submittedPrompt }],
					}),
				},
			);

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error?.message || "Groq API request failed");
			}

			setResponse(
				data.choices?.[0]?.message?.content || "No response received.",
			);
		} catch (error) {
			console.error(error);
			setResponse(error.message || "Error while connecting!");
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-1">
			{/* Main Chatbot */}
			<div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
				{/* ================= HEADER ================= */}
				<div className="flex items-center justify-between border-b border-slate-700 bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-4">
					<div className="flex items-center gap-3">
						{/* AI Logo */}
						<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								className="h-7 w-7 text-white">
								<rect
									x="4"
									y="6"
									width="16"
									height="13"
									rx="4"
									stroke="currentColor"
									strokeWidth="1.8"
								/>

								<circle cx="9" cy="12" r="1.3" fill="currentColor" />

								<circle cx="15" cy="12" r="1.3" fill="currentColor" />

								<path
									d="M9 16h6"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
								/>

								<path
									d="M12 6V3"
									stroke="currentColor"
									strokeWidth="1.8"
									strokeLinecap="round"
								/>

								<circle cx="12" cy="2.5" r="1" fill="currentColor" />
							</svg>
						</div>

						<div>
							<h1 className="text-lg font-bold text-white">AI Assistant</h1>

							<div className="flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>

								<span className="text-xs text-indigo-100">
									Online • Ready to help
								</span>
							</div>
						</div>
					</div>

					{/* Header badge */}
					<div className="hidden rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white sm:block">
						Groq AI
					</div>
				</div>

				{/* ================= CHAT AREA ================= */}
				<div className="min-h-[420px] max-h-[500px] space-y-6 overflow-y-auto bg-slate-950/70 px-4 py-6 sm:px-6">
					{/* Welcome Message */}
					<div className="flex items-start gap-3">
						{/* AI Icon */}
						<div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/30">
							<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
								<rect
									x="4"
									y="6"
									width="16"
									height="13"
									rx="4"
									stroke="currentColor"
									strokeWidth="1.8"
								/>

								<circle cx="9" cy="12" r="1.2" fill="currentColor" />

								<circle cx="15" cy="12" r="1.2" fill="currentColor" />

								<path
									d="M9 16h6"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
								/>

								<path
									d="M12 6V3"
									stroke="currentColor"
									strokeWidth="1.8"
									strokeLinecap="round"
								/>
							</svg>
						</div>

						<div className="max-w-[80%] rounded-2xl rounded-tl-md border border-slate-700 bg-slate-800 px-4 py-3 shadow-lg">
							<p className="text-sm leading-6 text-slate-200">
								Hello! 👋
								<br />
								How can I help you today?
							</p>
						</div>
					</div>

					{/* User Prompt */}
					{userMessage && (
						<div className="flex justify-end">
							<div className="flex max-w-[85%] items-end gap-3">
								<div className="rounded-2xl rounded-br-md bg-linear-to-r from-indigo-600 to-violet-600 px-4 py-3 shadow-lg shadow-indigo-900/20">
									<p className="text-sm leading-6 text-white">{userMessage}</p>
								</div>

								{/* Human Logo */}
								<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30">
									<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
										<circle
											cx="12"
											cy="8"
											r="3"
											stroke="currentColor"
											strokeWidth="1.8"
										/>

										<path
											d="M5.5 20c.7-4 2.8-6 6.5-6s5.8 2 6.5 6"
											stroke="currentColor"
											strokeWidth="1.8"
											strokeLinecap="round"
										/>
									</svg>
								</div>
							</div>
						</div>
					)}

					{/* AI Response */}
					{loading && (
						<div className="flex items-start gap-3">
							<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/30">
								<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
									<rect
										x="4"
										y="6"
										width="16"
										height="13"
										rx="4"
										stroke="currentColor"
										strokeWidth="1.8"
									/>

									<circle cx="9" cy="12" r="1.2" fill="currentColor" />

									<circle cx="15" cy="12" r="1.2" fill="currentColor" />

									<path
										d="M12 6V3"
										stroke="currentColor"
										strokeWidth="1.8"
										strokeLinecap="round"
									/>
								</svg>
							</div>

							<div className="rounded-2xl rounded-tl-md border border-slate-700 bg-slate-800 px-4 py-3">
								<div className="flex items-center gap-1.5">
									<span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400"></span>
									<span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:150ms]"></span>
									<span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:300ms]"></span>

									<span className="ml-2 text-xs text-slate-400">
										Thinking...
									</span>
								</div>
							</div>
						</div>
					)}

					{/* Actual Response */}
					{response && !loading && (
						<div className="flex items-start gap-3">
							{/* AI Logo beside response */}
							<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/30">
								<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
									<rect
										x="4"
										y="6"
										width="16"
										height="13"
										rx="4"
										stroke="currentColor"
										strokeWidth="1.8"
									/>

									<circle cx="9" cy="12" r="1.2" fill="currentColor" />

									<circle cx="15" cy="12" r="1.2" fill="currentColor" />

									<path
										d="M9 16h6"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
									/>

									<path
										d="M12 6V3"
										stroke="currentColor"
										strokeWidth="1.8"
										strokeLinecap="round"
									/>
								</svg>
							</div>

							<div className="max-w-[85%] rounded-2xl rounded-tl-md border border-slate-700 bg-slate-800 px-4 py-3 shadow-lg">
								<div className="text-sm leading-6 text-slate-200">
									<ReactMarkdown
										remarkPlugins={[remarkGfm]}
										components={{
											p: ({ children }) => (
												<p className="mb-3 last:mb-0">{children}</p>
											),

											strong: ({ children }) => (
												<strong className="font-bold text-white">
													{children}
												</strong>
											),

											ul: ({ children }) => (
												<ul className="my-3 list-disc space-y-1 pl-5">
													{children}
												</ul>
											),

											ol: ({ children }) => (
												<ol className="my-3 list-decimal space-y-1 pl-5">
													{children}
												</ol>
											),

											h1: ({ children }) => (
												<h1 className="mb-3 text-xl font-bold text-white">
													{children}
												</h1>
											),

											h2: ({ children }) => (
												<h2 className="mb-3 text-lg font-bold text-white">
													{children}
												</h2>
											),

											h3: ({ children }) => (
												<h3 className="mb-2 text-base font-bold text-white">
													{children}
												</h3>
											),

											table: ({ children }) => (
												<div className="my-4 overflow-x-auto">
													<table className="w-full border-collapse text-left text-sm">
														{children}
													</table>
												</div>
											),

											th: ({ children }) => (
												<th className="border border-slate-600 bg-slate-700 px-3 py-2 font-semibold text-white">
													{children}
												</th>
											),

											td: ({ children }) => (
												<td className="border border-slate-700 px-3 py-2 text-slate-300">
													{children}
												</td>
											),

											code: ({ children }) => (
												<code className="rounded bg-slate-700 px-1.5 py-0.5 text-indigo-300">
													{children}
												</code>
											),
										}}>
										{response}
									</ReactMarkdown>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* ================= INPUT AREA ================= */}
				<div className="border-t border-slate-700 bg-slate-900 p-4 sm:p-5">
					<form onSubmit={askAI} className="flex items-center gap-3">
						{/* Human Icon */}
						<div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/30 sm:flex">
							<svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
								<circle
									cx="12"
									cy="8"
									r="3"
									stroke="currentColor"
									strokeWidth="1.8"
								/>

								<path
									d="M5.5 20c.7-4 2.8-6 6.5-6s5.8 2 6.5 6"
									stroke="currentColor"
									strokeWidth="1.8"
									strokeLinecap="round"
								/>
							</svg>
						</div>

						{/* Input */}
						<div className="relative flex-1">
							<input
								type="text"
								value={prompt}
								onChange={(event) => setPrompt(event.target.value)}
								placeholder="Ask anything..."
								disabled={loading}
								className="w-full rounded-2xl border border-slate-700 bg-slate-800 py-3.5 pl-4 pr-14 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
							/>

							{/* Send Button */}
							<button
								type="submit"
								disabled={loading || !prompt.trim()}
								className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/30 transition hover:scale-105 hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100">
								<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
									<path
										d="M5 12h13"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
									/>

									<path
										d="m13 6 6 6-6 6"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
						</div>
					</form>

					<p className="mt-3 text-center text-[11px] text-slate-500">
						AI can make mistakes. Please verify important information.
					</p>
				</div>
			</div>
		</div>
	);
};

export default ChatBotAI;

// import { useState } from 'react'

// const ChatBotAI = () => {

//     const [prompt, setPrompt] = useState("")
//     const [response, setResponse] = useState("")
//     const [loading, setLoading] = useState(false);

//     const askAI = async (event) => {

//         event.preventDefault();

//         if (!prompt.trim()) return;

//         setLoading(true);
//         setResponse("");

//         try {
//             const res = await fetch(
//                 "https://api.groq.com/openai/v1/chat/completions", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
//                     },
//                     body: JSON.stringify({
//                         model: "openai/gpt-oss-20b",
//                         messages: [
//                             {
//                                 role: "user",
//                                 content: prompt
//                             }
//                         ]
//                     })
//                 }
//             );

//             const data = await res.json();

//             if (!res.ok) {
//                 throw new Error(data.error?.message || "Groq API request failed");
//             }

//             setResponse(data.choices?.[0]?.message?.content || "No response received.");
//             setPrompt("");

//         } catch (error) {
//             console.error(error);
//             setResponse(error.message || "Error while connecting!");
//         } finally {
//             setLoading(false);
//         }

//     }
//     return (
//         <>

//             <div>
//                 <h3 className='bg-orange-600 text-white font-bold p-4 text-center'>ASk AI Anything</h3>

//                 <form onSubmit={askAI}>

//                     <input
//                         type="text"
//                         value={prompt}
//                         onChange={(event) => { setPrompt(event.target.value) }}
//                         placeholder='Ask Anything...'
//                     />
//                     <button type='submit' disabled={loading}>
//                         {loading == true ? "Thinking..." : "ASK AI"}
//                     </button>
//                 </form>

//                 <hr />

//                 {
//                     response && (
//                         <div>
//                             <p>{response}</p>
//                         </div>
//                     )
//                 }

//             </div>

//         </>
//     )
// }

// export default ChatBotAI
