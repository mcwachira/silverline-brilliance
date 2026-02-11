// Mock Supabase client for development - replace with actual @supabase/supabase-js when installed

interface MockData {
  [key: string]: any[];
}

const mockData: MockData = {
  bookings: [
    {
      id: '1',
      booking_reference: 'BK-2024-0001',
      client_name: 'John Doe',
      client_email: 'john@example.com',
      client_phone: '+1-555-0123',
      company_name: 'Doe Corporation',
      event_name: 'Annual Company Gala',
      event_type: 'corporate',
      event_date: '2024-06-15',
      event_start_time: '19:00:00',
      event_end_time: '23:00:00',
      venue_location: 'Grand Ballroom, Hilton Hotel',
      venue_address: '123 Main St, City, State',
      expected_attendees: 150,
      services: ['Sound System', 'Lighting', 'Projector', 'DJ Services'],
      special_requirements: 'Need additional microphones for presentations',
      budget_range: '$5000-$10000',
      status: 'confirmed',
      preferred_contact: 'email',
      referral_source: 'Google',
      file_uploads: [],
      admin_notes: 'VIP client - provide premium service',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      booking_reference: 'BK-2024-0002',
      client_name: 'Jane Smith',
      client_email: 'jane@example.com',
      client_phone: '+1-555-0124',
      company_name: 'Smith Events',
      event_name: 'Wedding Reception',
      event_type: 'wedding',
      event_date: '2024-07-20',
      event_start_time: '18:00:00',
      event_end_time: '00:00:00',
      venue_location: 'Garden Pavilion',
      venue_address: '456 Oak Ave, Town, State',
      expected_attendees: 200,
      services: ['Sound System', 'Lighting', 'Photo Booth'],
      special_requirements: 'Outdoor event - weather contingency needed',
      budget_range: '$10000-$15000',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  booking_history: [
    {
      id: '1',
      booking_id: '1',
      action_type: 'created',
      action_description: 'Booking created successfully',
      new_value: { client_name: 'John Doe' },
      performed_by: 'admin',
      performed_at: new Date().toISOString()
    }
  ]
};

class MockSupabaseClient {
  private url: string;
  private key: string;

  constructor(url: string, key: string) {
    this.url = url;
    this.key = key;
  }

  // Auth mock
  auth = {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // Mock successful login for demo credentials
      if (email === 'admin@silverlinetech.com' && password === 'admin123') {
        return {
          data: {
            user: { id: '1', email: 'admin@silverlinetech.com' },
            session: { access_token: 'mock-token', user: { id: '1', email: 'admin@silverlinetech.com' } }
          },
          error: null
        };
      }
      return {
        data: null,
        error: { message: 'Invalid credentials' }
      };
    },
    
    signOut: async () => {
      return { error: null };
    },
    
    getSession: async () => {
      return {
        data: {
          session: null // Will be implemented with proper session management
        }
      };
    },
    
    onAuthStateChange: () => {
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }
  };

  // Database mock
  from = (table: string) => {
    const tableData = mockData[table] || [];
    
    return {
      select: (columns: string | { count: string }, options?: { count?: string }) => {
        // Handle both select('*', { count: 'exact' }) and select('*') formats
        const shouldCount = typeof columns === 'object' || options?.count === 'exact';
        return this.createQueryMethods(tableData, shouldCount);
      },
      insert: (data: any) => ({
        select: (columns = '*') => ({
          single: () => ({
            then: async (resolve: (value: any) => void) => {
              const newItem = Array.isArray(data) ? data[0] : data;
              newItem.id = Math.random().toString(36).substr(2, 9);
              newItem.created_at = new Date().toISOString();
              mockData[table].push(newItem);
              resolve({
                data: newItem,
                error: null
              });
            }
          }),
          then: async (resolve: (value: any) => void) => {
            const newItem = Array.isArray(data) ? data[0] : data;
            newItem.id = Math.random().toString(36).substr(2, 9);
            newItem.created_at = new Date().toISOString();
            mockData[table].push(newItem);
            resolve({
              data: [newItem],
              error: null
            });
          }
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: (columns = '*') => ({
            single: () => ({
              then: async (resolve: (value: any) => void) => {
                const index = tableData.findIndex(item => item[column] === value);
                if (index !== -1) {
                  mockData[table][index] = { ...mockData[table][index], ...data, updated_at: new Date().toISOString() };
                  resolve({
                    data: mockData[table][index],
                    error: null
                  });
                } else {
                  resolve({
                    data: null,
                    error: { message: 'Record not found' }
                  });
                }
              }
            })
          })
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: async (resolve: (value: any) => void) => {
            const index = tableData.findIndex(item => item[column] === value);
            if (index !== -1) {
              mockData[table].splice(index, 1);
              resolve({
                data: null,
                error: null
              });
            } else {
              resolve({
                data: null,
                error: { message: 'Record not found' }
              });
            }
          }
        })
      })
    };
  };

  private createQueryMethods(data: any[], shouldCount: boolean = false) {
    return {
      eq: (column: string, value: any) => {
        const filteredData = data.filter(item => item[column] === value);
        return this.createQueryMethods(filteredData, shouldCount);
      },
      or: (condition: string) => {
        // Simple mock for or conditions - just return all data for now
        return this.createQueryMethods(data, shouldCount);
      },
      order: (column: string, options?: { ascending?: boolean }) => {
        const sortedData = [...data].sort((a, b) => {
          const aVal = a[column];
          const bVal = b[column];
          if (options?.ascending) {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
        return this.createQueryMethods(sortedData, shouldCount);
      },
      range: (from: number, to: number) => {
        const paginatedData = data.slice(from, to + 1);
        return this.createQueryMethods(paginatedData, shouldCount);
      },
      single: () => ({
        then: async (resolve: (value: any) => void) => {
          resolve({
            data: data[0] || null,
            error: data.length === 0 ? { code: 'PGRST116', message: 'No rows found' } : null
          });
        }
      }),
      then: async (resolve: (value: any) => void) => {
        resolve({
          data,
          error: null,
          count: shouldCount ? data.length : undefined
        });
      }
    };
  }
}

export const createClient = (url: string, key: string) => {
  return new MockSupabaseClient(url, key);
};
