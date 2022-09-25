import { useEffect, useState } from "react";
import axios from "axios";

export default function usePlayerSearch(query, pageNumber) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [players, setPlayers] = useState([]);
	const [hasMore, setHasMore] = useState(false);
    
    useEffect(()=>{
        setPlayers([])
    },[query])
    
	useEffect(() => {
		setLoading(true);
		setError(false);
		let cancel;
		axios({
			method: "GET",
			url: `https://www.balldontlie.io/api/v1/players?page=1&per_page=100`,
			params: { q: query, pageNumber: pageNumber },
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
		})
			.then((res) => {
				setPlayers((prevPlayers) => {
					return [
						...new Set([
							...prevPlayers,
							...res.data.data.map((b) => b.first_name),
						]),
					];
				});
				setHasMore(res.data.length > 0);
				setLoading(false);
				console.log(res.data);
			})
			.catch((e) => {
				if (axios.isCancel(e)) return;
				setError(true);
			});
		return () => cancel();
	}, [query, pageNumber]);

	return { loading, error, players, hasMore };
	// return null
}
