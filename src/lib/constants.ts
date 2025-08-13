import MdiEmailOutline from '~icons/mdi/email-outline';
import MdiKeyOutline from '~icons/mdi/key-outline';
import MdiAccountRemove from '~icons/mdi/account-remove';

export const accountSettings = [
	{
		name: 'change_password',
		pathName: '/settings/change-password',
		icon: MdiKeyOutline
	},
	{
		name: 'change_email',
		pathName: '/settings/change-email',
		icon: MdiEmailOutline
	},
	{
		name: 'delete_account',
		pathName: '/settings/delete-account',
		icon: MdiAccountRemove
	}
];
