// 1. For Super Admin: Create admin9912 style usernames
export const generateAdminCreds = () => {
  const user = `admin${Math.floor(1000 + Math.random() * 9000)}`;
  const pass = Array.from({length: 14}, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]).join('');
  return { user, pass };
};

// 2. For Admin: Create jdoe_dak44 style usernames for students
export const generateStudentUser = (fn, ln, loc) => {
  if (!fn || !ln) return "pending...";
  const base = `${fn[0]}${ln}`.toLowerCase().replace(/\s/g, '');
  const area = loc ? loc.substring(0, 3).toLowerCase() : "stu";
  return `${base}_${area}${Math.floor(Math.random() * 99)}`;
};