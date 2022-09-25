import React, { useState, useRef, useCallback } from "react";
import usePlayerSearch from "./usePlayerSearch";

function App() {
	const [query, setQuery] = useState("");
	const [pageNumber, setPageNumber] = useState(1);
	const { players, hasMore, loading, error } = usePlayerSearch(
		query,
		pageNumber
	);

	const observer = useRef();
	const lastPlayerRef = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPageNumber((prevPageNumber) => prevPageNumber + 1);
				}
			});
			if (node) observer.current.observe(node);
			console.log(node);
		},
		[loading, hasMore]
	);

	function handleSearch(e) {
		setQuery(e.target.value);
		setPageNumber(1);
	}

	usePlayerSearch(query, pageNumber);
  
	return (
		<>
			<input type="text" value={query} onChange={handleSearch} />
			{players.map((player, index) => {
				if (players.length === index + 1) {
					return (
						<div ref={lastPlayerRef} key={player}>
							{player}
						</div>
					);
				} else {
					return (
						<div key={player} style={{ margin: "50px 0" }}>
							{player}
						</div>
					);
				}
			})}
			<div>{loading && "Loading..."}</div>
			<div>{error && "Error"}</div>
			{/* <input type="text" onChange={handleSearch} ></input>
      <div>Title</div>
      <div>Title</div>
      <div>Title</div>
      <div>Title</div>
      <div>Loading...</div>
      <div>Error</div> */}
		</>
	);
}

export default App;
