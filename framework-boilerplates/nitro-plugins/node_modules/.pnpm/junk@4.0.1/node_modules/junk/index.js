const ignoreList = [
	// # All
	'^npm-debug\\.log$', // Error log for npm
	'^\\..*\\.swp$', // Swap file for vim state

	// # macOS
	'^\\.DS_Store$', // Stores custom folder attributes
	'^\\.AppleDouble$', // Stores additional file resources
	'^\\.LSOverride$', // Contains the absolute path to the app to be used
	'^Icon\\r$', // Custom Finder icon: http://superuser.com/questions/298785/icon-file-on-os-x-desktop
	'^\\._.*', // Thumbnail
	'^\\.Spotlight-V100(?:$|\\/)', // Directory that might appear on external disk
	'\\.Trashes', // File that might appear on external disk
	'^__MACOSX$', // Resource fork

	// # Linux
	'~$', // Backup file

	// # Windows
	'^Thumbs\\.db$', // Image file cache
	'^ehthumbs\\.db$', // Folder config file
	'^[Dd]esktop\\.ini$', // Stores custom folder attributes
	'@eaDir$', // Synology Diskstation "hidden" folder where the server stores thumbnails
];

export const junkRegex = new RegExp(ignoreList.join('|'));

export function isJunk(filename) {
	return junkRegex.test(filename);
}

export function isNotJunk(filename) {
	return !isJunk(filename);
}
