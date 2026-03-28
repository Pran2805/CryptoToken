export const validateUsername = (username) => {
    if (!username) {
        return 'Username is required';
    }
    if (username.length < 3) {
        return 'Username must be at least 3 characters long';
    }
    if (username.length > 30) {
        return 'Username must be less than 30 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return 'Username can only contain letters, numbers, and underscores';
    }
    return null;
};

export const validateAddress = (address) => {
    if (!address) {
        return 'Address is required';
    }
    if (address.length < 10) {
        return 'Invalid address format';
    }
    return null;
};

export const validateAmount = (amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
        return 'Amount must be a positive number';
    }
    return null;
};

export const validateTransaction = (fromAddress, toAddress, amount) => {
    if (!fromAddress || !toAddress || !amount) {
        return 'fromAddress, toAddress, and amount are required';
    }
    
    const fromError = validateAddress(fromAddress);
    if (fromError) return fromError;
    
    const toError = validateAddress(toAddress);
    if (toError) return toError;
    
    const amountError = validateAmount(amount);
    if (amountError) return amountError;
    
    return null;
};