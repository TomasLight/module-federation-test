function isConstructor(func: any) {
	try {
		new func();
	} catch (err) {
		if (err.message.indexOf('is not a constructor') >= 0) {
			return false;
		}
	}
	return true;
}

export { isConstructor };
