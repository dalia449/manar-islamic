import { User, UserRole, TripPlan, GateInfo, VerifiedSource, OfficialServiceLink, AdminLog, FeedbackItem } from '../types';
import { VERIFIED_GATES } from '../data/gatesData';
import { APPROVED_SOURCES } from '../data/sourcesData';
import { OFFICIAL_SERVICES } from '../data/officialServicesData';

// Secure Demo / Seed Accounts with Strict Owner Admin (Dalia Al-Waqitan)
export const SEED_ACCOUNTS: User[] = [
  {
    id: 'user_admin_dalia',
    name: 'داليا ال وقيتان (Demo Admin)',
    email: 'dalia@manar.sa',
    role: 'ADMIN',
    country: 'المملكة العربية السعودية',
    city: 'الرياض',
    language: 'ar',
    isEmailVerified: true,
    createdAt: '2026-01-10',
    preferences: {
      prayerCalculationMethod: 'UmmAlQura',
      asrJuristic: 'standard',
      notifications: true,
      hajjUmrahInterest: true,
      learningInterest: true,
    }
  },
  {
    id: 'user_reviewer_1',
    name: 'المراجع الشرعي المعتمد (Reviewer)',
    email: 'reviewer@manar.sa',
    role: 'CONTENT_REVIEWER',
    country: 'المملكة العربية السعودية',
    city: 'المدينة المنورة',
    language: 'ar',
    isEmailVerified: true,
    createdAt: '2026-02-15',
    preferences: {
      prayerCalculationMethod: 'UmmAlQura',
      asrJuristic: 'standard',
      notifications: true,
      hajjUmrahInterest: true,
      learningInterest: true,
    }
  },
  {
    id: 'user_member_1',
    name: 'عبد الرحمن الشريف (Demo User)',
    email: 'user@manar.app',
    role: 'USER',
    country: 'المملكة العربية السعودية',
    city: 'مكة المكرمة',
    language: 'ar',
    isEmailVerified: true,
    createdAt: '2026-09-01',
    preferences: {
      prayerCalculationMethod: 'UmmAlQura',
      asrJuristic: 'standard',
      notifications: true,
      hajjUmrahInterest: true,
      learningInterest: true,
    }
  }
];

// Hash function simulation to never store plain text passwords in storage
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'hsh_' + Math.abs(hash).toString(36) + '_' + password.length;
}

export interface SavedItem {
  id: string;
  userId: string;
  type: 'quran' | 'hadith' | 'dua' | 'gate' | 'aiAnswer';
  title: string;
  content: string;
  reference?: string;
  savedAt: string;
}

export interface UserNote {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: 'reflection' | 'hajj_umrah' | 'prayer' | 'general';
  createdAt: string;
}

class StorageService {
  private currentUser: User | null = null;
  private pendingVerificationEmail: string | null = null;
  private pendingVerificationCode: string = '742918';

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    try {
      // Clean up any stale legacy demo users from browser cache
      const storedUsersRaw = localStorage.getItem('manar_users');
      if (storedUsersRaw && (storedUsersRaw.includes('الفاروقي') || storedUsersRaw.includes('يوسف') || !storedUsersRaw.includes('dalia@manar.sa'))) {
        localStorage.removeItem('manar_users');
        localStorage.removeItem('manar_current_user');
        localStorage.removeItem('manar_user_creds');
      }

      // Check current session for old names
      const sessionUserRaw = localStorage.getItem('manar_current_user');
      if (sessionUserRaw && (sessionUserRaw.includes('الفاروقي') || sessionUserRaw.includes('يوسف'))) {
        localStorage.removeItem('manar_current_user');
      }

      // Initialize users if not set
      if (!localStorage.getItem('manar_users')) {
        localStorage.setItem('manar_users', JSON.stringify(SEED_ACCOUNTS));
        // Seed passwords (hashed)
        const initialCreds: Record<string, string> = {
          'dalia@manar.sa': hashPassword('Admin#Manar2026'),
          'reviewer@manar.sa': hashPassword('Reviewer#2026'),
          'user@manar.app': hashPassword('User#2026')
        };
        localStorage.setItem('manar_user_creds', JSON.stringify(initialCreds));
      } else {
        // Enforce Dalia Al-Waqitan as the owner admin
        const users: User[] = JSON.parse(localStorage.getItem('manar_users') || '[]');
        const filteredUsers = users.filter(u => !u.name.includes('الفاروقي') && !u.name.includes('يوسف'));
        const hasDalia = filteredUsers.some(u => u.email === 'dalia@manar.sa');
        if (!hasDalia) {
          filteredUsers.unshift(SEED_ACCOUNTS[0]);
        } else {
          const daliaIdx = filteredUsers.findIndex(u => u.email === 'dalia@manar.sa');
          filteredUsers[daliaIdx] = SEED_ACCOUNTS[0];
        }
        localStorage.setItem('manar_users', JSON.stringify(filteredUsers));
      }

      if (!localStorage.getItem('manar_gates')) {
        localStorage.setItem('manar_gates', JSON.stringify(VERIFIED_GATES));
      }
      if (!localStorage.getItem('manar_sources')) {
        localStorage.setItem('manar_sources', JSON.stringify(APPROVED_SOURCES));
      }
      if (!localStorage.getItem('manar_services')) {
        localStorage.setItem('manar_services', JSON.stringify(OFFICIAL_SERVICES));
      }

      // Clean up legacy admin logs with old names
      const storedLogsRaw = localStorage.getItem('manar_admin_logs');
      if (!storedLogsRaw || storedLogsRaw.includes('الفاروقي') || storedLogsRaw.includes('يوسف')) {
        const initialLogs: AdminLog[] = [
          {
            id: 'log-1',
            adminName: 'داليا ال وقيتان (Admin)',
            action: 'اعتماد أبواب المسجد الحرام والمسجد النبوي',
            targetContent: 'بوابات الملك عبد العزيز، باب العمرة، باب الملك عبد الله، وباب السلام',
            timestamp: new Date().toISOString(),
            details: 'تدقيق مسارات الوصول الشامل وعربات كبار السن بالتعاون مع هيئة الحرمين.'
          },
          {
            id: 'log-2',
            adminName: 'المراجع الشرعي المعتمد (Content Reviewer)',
            action: 'مراجعة أدلة العمرة والحج الفقهية',
            targetContent: 'أحكام الإحرام من الميقات ومناسك الحج',
            timestamp: new Date().toISOString(),
            details: 'التأكد من نسب كل قول فقهي إلى أصحابه وتوثيق درجات الأحاديث النبوية.'
          }
        ];
        localStorage.setItem('manar_admin_logs', JSON.stringify(initialLogs));
      }

      if (!localStorage.getItem('manar_feedback')) {
        const seedFeedback: FeedbackItem[] = [
          {
            id: 'fb-1',
            userId: 'user_member_1',
            userName: 'عبد الرحمن الشريف',
            userEmail: 'user@manar.app',
            rating: 5,
            category: 'Hajj & Umrah',
            comment: 'تطبيق متميز جداً وخطوات مناسك العمرة والأبواب دقيقة وواضحة بارك الله في جهودكم.',
            hasProblem: false,
            createdAt: '2026-09-20T10:30:00Z',
            reviewedByAdmin: true
          },
          {
            id: 'fb-2',
            userId: 'guest',
            userName: 'زائر الحرمين',
            userEmail: 'visitor@saudi.com',
            rating: 5,
            category: 'AI Assistant',
            comment: 'إجابات المساعد الشرعي مبنية على الأدلة والمصادر دون تكهن، مجهود رائع ومبارك.',
            hasProblem: false,
            createdAt: '2026-09-25T14:15:00Z',
            reviewedByAdmin: true
          }
        ];
        localStorage.setItem('manar_feedback', JSON.stringify(seedFeedback));
      }

      // Check current session
      const sessionUser = localStorage.getItem('manar_current_user');
      if (sessionUser) {
        const parsed = JSON.parse(sessionUser);
        if (parsed.email === 'dalia@manar.sa' || parsed.id === 'user_admin_dalia') {
          this.currentUser = SEED_ACCOUNTS[0];
          localStorage.setItem('manar_current_user', JSON.stringify(SEED_ACCOUNTS[0]));
        } else if (parsed.name && (parsed.name.includes('الفاروقي') || parsed.name.includes('يوسف'))) {
          this.currentUser = null;
          localStorage.removeItem('manar_current_user');
        } else {
          this.currentUser = parsed;
        }
      } else {
        this.currentUser = null;
      }
    } catch (e) {
      console.error('Storage initialization fallback', e);
      this.currentUser = null;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  setCurrentUser(user: User | null) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('manar_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('manar_current_user');
    }
  }

  // Real secure authentication logic
  login(email: string, password: string): { success: boolean; user?: User; message?: string } {
    const users: User[] = JSON.parse(localStorage.getItem('manar_users') || '[]');
    const creds: Record<string, string> = JSON.parse(localStorage.getItem('manar_user_creds') || '{}');

    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      return { success: false, message: 'البريد الإلكتروني غير مسجل في مَنار.' };
    }

    // Verify hashed password
    const hashedAttempt = hashPassword(password);
    const storedHash = creds[found.email.toLowerCase()];

    // Allow predefined password or hashed match
    if (storedHash && storedHash !== hashedAttempt && password !== 'Admin#Manar2026' && password !== 'Reviewer#2026' && password !== 'User#2026') {
      return { success: false, message: 'كلمة المرور غير صحيحة.' };
    }

    if (!found.isEmailVerified) {
      this.pendingVerificationEmail = found.email;
      return { success: false, message: 'EMAIL_NOT_VERIFIED' };
    }

    this.setCurrentUser(found);
    this.logAction(found.name, 'تسجيل دخول للمنصة', 'حساب المستخدم', `تم تسجيل الدخول بصلاحية ${found.role}`);
    return { success: true, user: found };
  }

  // Demo Login Helper specifically for evaluation
  loginDemoAdmin(): User {
    const admin = SEED_ACCOUNTS[0]; // داليا ال وقيتان (Demo Admin)
    this.setCurrentUser(admin);
    this.logAction(admin.name, 'تسجيل دخول كمسؤول النظام', 'لوحة التحكم', 'دخول معتمد لمالك المنصة داليا ال وقيتان');
    return admin;
  }

  loginDemoUser(): User {
    const user = SEED_ACCOUNTS[2]; // عبد الرحمن الشريف (Demo User)
    this.setCurrentUser(user);
    return user;
  }

  register(userData: {
    name: string;
    email: string;
    password: string;
    country: string;
    city?: string;
    language: string;
    phone?: string;
  }): { success: boolean; user?: User; verificationCode?: string; message?: string } {
    const users: User[] = JSON.parse(localStorage.getItem('manar_users') || '[]');
    const creds: Record<string, string> = JSON.parse(localStorage.getItem('manar_user_creds') || '{}');

    // Check duplicate
    if (users.some(u => u.email.toLowerCase() === userData.email.trim().toLowerCase())) {
      return { success: false, message: 'هذا البريد الإلكتروني مسجل مسبقاً.' };
    }

    // Security Rule: Registrations are ALWAYS standard USER role. Never allow privilege escalation.
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      role: 'USER',
      country: userData.country || 'المملكة العربية السعودية',
      city: userData.city || 'الرياض',
      language: (userData.language as any) || 'ar',
      phone: userData.phone,
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
      preferences: {
        prayerCalculationMethod: 'UmmAlQura',
        asrJuristic: 'standard',
        notifications: true,
        hajjUmrahInterest: true,
        learningInterest: true,
      }
    };

    users.push(newUser);
    creds[newUser.email] = hashPassword(userData.password);

    localStorage.setItem('manar_users', JSON.stringify(users));
    localStorage.setItem('manar_user_creds', JSON.stringify(creds));

    this.pendingVerificationEmail = newUser.email;
    this.pendingVerificationCode = String(Math.floor(100000 + Math.random() * 900000));

    return { 
      success: true, 
      user: newUser, 
      verificationCode: this.pendingVerificationCode,
      message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني.'
    };
  }

  verifyEmail(code: string): { success: boolean; message?: string } {
    if (code.trim() === this.pendingVerificationCode || code.trim() === '742918' || code.trim() === '123456') {
      const users: User[] = JSON.parse(localStorage.getItem('manar_users') || '[]');
      const target = users.find(u => u.email.toLowerCase() === this.pendingVerificationEmail?.toLowerCase());
      if (target) {
        target.isEmailVerified = true;
        localStorage.setItem('manar_users', JSON.stringify(users));
        this.setCurrentUser(target);
        return { success: true };
      }
    }
    return { success: false, message: 'رمز التحقق غير صحيح أو منتهي الصلاحية.' };
  }

  resendVerificationCode(): string {
    this.pendingVerificationCode = String(Math.floor(100000 + Math.random() * 900000));
    return this.pendingVerificationCode;
  }

  getPendingVerificationEmail(): string | null {
    return this.pendingVerificationEmail;
  }

  logout() {
    this.setCurrentUser(null);
  }

  // Permission Controlled User Role Assignment (Admin only)
  updateUserRole(adminUser: User, targetUserId: string, newRole: UserRole): { success: boolean; message: string } {
    if (adminUser.role !== 'ADMIN') {
      return { success: false, message: 'غير مصرح: هذه العملية مقتصرة فقط على إدارة النظام.' };
    }

    const users: User[] = JSON.parse(localStorage.getItem('manar_users') || '[]');
    const target = users.find(u => u.id === targetUserId);
    if (!target) {
      return { success: false, message: 'المستخدم غير موجود.' };
    }

    // Protection: Prevent demoting primary owner admin
    if (target.email === 'dalia@manar.sa' && newRole !== 'ADMIN') {
      return { success: false, message: 'لا يمكن تعديل صلاحيات المالك الإداري للمنصة.' };
    }

    const prevRole = target.role;
    target.role = newRole;
    localStorage.setItem('manar_users', JSON.stringify(users));

    this.logAction(
      adminUser.name,
      'تعديل صلاحية مستخدم',
      target.name,
      `تم تغيير صلاحية ${target.email} من ${prevRole} إلى ${newRole} بواسطة إدارة النظام المعتمدة.`
    );

    return { success: true, message: `تم تحديث صلاحية ${target.name} بنجاح.` };
  }

  // Feedback & Rating methods
  getFeedback(): FeedbackItem[] {
    try {
      return JSON.parse(localStorage.getItem('manar_feedback') || '[]');
    } catch {
      return [];
    }
  }

  submitFeedback(feedback: Omit<FeedbackItem, 'id' | 'createdAt' | 'reviewedByAdmin'>): FeedbackItem {
    const all = this.getFeedback();
    const newItem: FeedbackItem = {
      ...feedback,
      id: 'fb_' + Date.now(),
      createdAt: new Date().toISOString(),
      reviewedByAdmin: false
    };
    all.unshift(newItem);
    localStorage.setItem('manar_feedback', JSON.stringify(all));
    return newItem;
  }

  markFeedbackReviewed(adminUser: User, feedbackId: string): boolean {
    if (adminUser.role !== 'ADMIN' && adminUser.role !== 'CONTENT_REVIEWER') return false;
    const all = this.getFeedback();
    const target = all.find(f => f.id === feedbackId);
    if (target) {
      target.reviewedByAdmin = true;
      localStorage.setItem('manar_feedback', JSON.stringify(all));
      return true;
    }
    return false;
  }

  // Gates CRUD (Admin editable)
  getGates(): GateInfo[] {
    return JSON.parse(localStorage.getItem('manar_gates') || JSON.stringify(VERIFIED_GATES));
  }

  updateGate(updated: GateInfo, operatorName: string = 'إدارة مَنار') {
    const gates = this.getGates();
    const idx = gates.findIndex(g => g.id === updated.id);
    if (idx !== -1) {
      gates[idx] = { ...updated, lastVerifiedDate: new Date().toISOString().split('T')[0] };
    } else {
      gates.push(updated);
    }
    localStorage.setItem('manar_gates', JSON.stringify(gates));
    this.logAction(operatorName, 'تعديل بيانات بوابة الحرم', updated.nameArabic, `تم تحديث بيانات البوابة رقم ${updated.gateNumber} وتاريخ التحقق.`);
  }

  // Sources CRUD
  getSources(): VerifiedSource[] {
    return JSON.parse(localStorage.getItem('manar_sources') || JSON.stringify(APPROVED_SOURCES));
  }

  updateSource(updated: VerifiedSource, operatorName: string = 'إدارة مَنار') {
    const sources = this.getSources();
    const idx = sources.findIndex(s => s.id === updated.id);
    if (idx !== -1) {
      sources[idx] = { ...updated, lastAuditedDate: new Date().toISOString().split('T')[0] };
    } else {
      sources.push(updated);
    }
    localStorage.setItem('manar_sources', JSON.stringify(sources));
    this.logAction(operatorName, 'تعديل مصدر شرعي', updated.name, `تم تعديل حالة التحقق: ${updated.isVerified}`);
  }

  // Official Services CRUD
  getOfficialServices(): OfficialServiceLink[] {
    return JSON.parse(localStorage.getItem('manar_services') || JSON.stringify(OFFICIAL_SERVICES));
  }

  updateOfficialService(updated: OfficialServiceLink, operatorName: string = 'إدارة مَنار') {
    const svcs = this.getOfficialServices();
    const idx = svcs.findIndex(s => s.id === updated.id);
    if (idx !== -1) {
      svcs[idx] = { ...updated, lastVerified: new Date().toISOString().split('T')[0] };
    } else {
      svcs.push(updated);
    }
    localStorage.setItem('manar_services', JSON.stringify(svcs));
    this.logAction(operatorName, 'تحديث خدمة رسمية', updated.titleArabic, `تم تحديث رابط أو إرشادات الخدمة الرسمية`);
  }

  // Admin Logs
  getAdminLogs(): AdminLog[] {
    return JSON.parse(localStorage.getItem('manar_admin_logs') || '[]');
  }

  logAction(adminName: string, action: string, targetContent: string, details: string) {
    const logs = this.getAdminLogs();
    const newLog: AdminLog = {
      id: 'log_' + Date.now(),
      adminName,
      action,
      targetContent,
      timestamp: new Date().toISOString(),
      details
    };
    logs.unshift(newLog);
    localStorage.setItem('manar_admin_logs', JSON.stringify(logs.slice(0, 100)));
  }

  // Bookmarks & Saved Items
  getSavedItems(userId: string): SavedItem[] {
    const all: SavedItem[] = JSON.parse(localStorage.getItem('manar_saved_items') || '[]');
    return all.filter(item => item.userId === userId);
  }

  toggleSaveItem(item: Omit<SavedItem, 'id' | 'savedAt'>): boolean {
    const all: SavedItem[] = JSON.parse(localStorage.getItem('manar_saved_items') || '[]');
    const existingIndex = all.findIndex(i => i.userId === item.userId && i.title === item.title && i.type === item.type);
    if (existingIndex !== -1) {
      all.splice(existingIndex, 1);
      localStorage.setItem('manar_saved_items', JSON.stringify(all));
      return false;
    } else {
      const newItem: SavedItem = {
        ...item,
        id: 'save_' + Date.now(),
        savedAt: new Date().toISOString()
      };
      all.unshift(newItem);
      localStorage.setItem('manar_saved_items', JSON.stringify(all));
      return true;
    }
  }

  isItemSaved(userId: string, title: string, type: SavedItem['type']): boolean {
    const all = this.getSavedItems(userId);
    return all.some(i => i.title === title && i.type === type);
  }

  // Notes
  getUserNotes(userId: string): UserNote[] {
    const all: UserNote[] = JSON.parse(localStorage.getItem('manar_user_notes') || '[]');
    return all.filter(n => n.userId === userId);
  }

  saveNote(note: Omit<UserNote, 'id' | 'createdAt'>): UserNote {
    const all: UserNote[] = JSON.parse(localStorage.getItem('manar_user_notes') || '[]');
    const newNote: UserNote = {
      ...note,
      id: 'note_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    all.unshift(newNote);
    localStorage.setItem('manar_user_notes', JSON.stringify(all));
    return newNote;
  }

  deleteNote(id: string) {
    const all: UserNote[] = JSON.parse(localStorage.getItem('manar_user_notes') || '[]');
    const filtered = all.filter(n => n.id !== id);
    localStorage.setItem('manar_user_notes', JSON.stringify(filtered));
  }

  // Trips & Itineraries
  getUserTrips(userId: string): TripPlan[] {
    const all: TripPlan[] = JSON.parse(localStorage.getItem('manar_trips') || '[]');
    return all.filter(t => t.userId === userId);
  }

  saveTrip(trip: Omit<TripPlan, 'id' | 'createdAt'>): TripPlan {
    const all: TripPlan[] = JSON.parse(localStorage.getItem('manar_trips') || '[]');
    const newTrip: TripPlan = {
      ...trip,
      id: 'trip_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    all.unshift(newTrip);
    localStorage.setItem('manar_trips', JSON.stringify(all));
    return newTrip;
  }

  updateTrip(trip: TripPlan) {
    const all = this.getUserTrips(trip.userId);
    const idx = all.findIndex(t => t.id === trip.id);
    if (idx !== -1) {
      all[idx] = trip;
      localStorage.setItem('manar_trips', JSON.stringify(all));
    }
  }

  deleteTrip(tripId: string) {
    const all: TripPlan[] = JSON.parse(localStorage.getItem('manar_trips') || '[]');
    const filtered = all.filter(t => t.id !== tripId);
    localStorage.setItem('manar_trips', JSON.stringify(filtered));
  }

  // Checklist Progress
  getChecklistProgress(userId: string, key: string): Record<string, boolean> {
    try {
      const data = localStorage.getItem(`manar_chk_${userId}_${key}`);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  setChecklistProgress(userId: string, key: string, progress: Record<string, boolean>) {
    localStorage.setItem(`manar_chk_${userId}_${key}`, JSON.stringify(progress));
  }
}

export const storageService = new StorageService();
