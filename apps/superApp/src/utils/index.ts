
export const maskEmailAddress = (email:string | null) =>{
  const count = 4
  if(email === null) return 
  const parts = email.split("@");
  const username = parts[0];
  const domain = parts[1];

  if (count < 0) {
    return email; // Return the original email if the count is invalid
  }

  const maskedUsername = username.slice(0, 4) + "*".repeat(count) + username.slice(-4);
  return `${maskedUsername}@${domain}`;
}

