//1
<form onSubmit={handleFormSubmit} className="w-full max-w-md mx-auto">
  <div className="flex flex-col items-center">
    <textarea
      className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
      id="message"
      name="message"
      value={messageText}
      onChange={handleMessageTextChange}
      onKeyDown={handleKeyPress}
      placeholder="Write text..."
      autoComplete="off"
    />
    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
    >
      Send
    </button>
  </div>
</form>

//2

<form onSubmit={handleFormSubmit}>
  <div className="flex flex-row items-center">
    <textarea
      className="w-full border rounded-md py-2 px-4 shadow-sm placeholder:italic placeholder:text-slate-400 bg-white border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 resize-y"
      id="message"
      name="message"
      value={messageText}
      onChange={handleMessageTextChange}
      onKeyDown={handleKeyPress}
      placeholder="Write text..."
      autoComplete="off"
      style={{ height: '5rem', overflowY: 'auto' }}
    />
    <button
      type="submit"
      className="bg-slate-400 rounded-lg ml-3 px-4 py-1"
    >
      Send
    </button>
  </div>
</form>


//3
<form onSubmit={handleFormSubmit}>
  <div className="flex flex-row items-center">
    <textarea
      className="w-full border rounded-md py-2 px-4 shadow-sm placeholder:italic placeholder:text-slate-400 bg-white border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 resize-y"
      id="message"
      name="message"
      value={messageText}
      onChange={handleMessageTextChange}
      onKeyDown={handleKeyPress}
      placeholder="Write text..."
      autoComplete="off"
      style={{ height: '5rem', overflowY: 'auto' }}
    />
    <button
      type="submit"
      className="bg-slate-400 rounded-lg ml-3 px-4 py-1"
    >
      Send
    </button>
  </div>
</form>
//