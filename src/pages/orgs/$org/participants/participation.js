import { Store } from '@src/api/computed/store.js';

export async function get({ data }) {
	const { org } = data;
	const h1 = 'Participation';
	const {
		participants: allParticipants,
		participationByParticipant
	} = await Store(org.id);

	const participants = allParticipants
		.filter((p) => participationByParticipant.has(p.id))
		.map((p) => {
			const participation = participationByParticipant.get(p.id)
			const [attendsCount, organizesCount] = participation;
			return {
				...p,
				attendsCount,
				organizesCount
			};
		});

	const template = { h1, participants };
	return { template };
}
