class SupabaseService {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
  }

  async fetchData(tableName) {
    const { data, error } = await this.supabase
      .from(tableName)
      .select('*');

    if (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
    return data;
  }

  async insertData(tableName, data) {
    const { data: insertedData, error } = await this.supabase
      .from(tableName)
      .insert(data);

    if (error) {
      throw new Error(`Error inserting data: ${error.message}`);
    }
    return insertedData;
  }
}

export default SupabaseService;