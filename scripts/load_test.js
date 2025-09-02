import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
	vus: 100, // virtual users
	duration: '1m',
	thresholds: {
		http_req_duration: ['p(95)<500'], // 95% of requests should be under 500ms
		http_req_failed: ['rate<0.05'] // Less than 5% of requests should fail
	}
};

export default function () {
	// const url =
	// 	'https://uo-explorer.makerepo.com/ors/v2/directions/foot-walking?start=-75.677696,45.4230016&end=-75.68129,45.421362';
	const url = 'https://uo-explorer.makerepo.com/api/health';

	const res = http.get(url);

	check(res, {
		'status is 200': (r) => r.status === 200
	});

	// user think time
	sleep(1);
}
