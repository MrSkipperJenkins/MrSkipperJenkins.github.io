// Initialize Supabase client
const supabaseUrl = 'https://cerwpqdmamkxokvoopwu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcndwcWRtYW1reG9rdm9vcHd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODgxOTIsImV4cCI6MjA1NzA2NDE5Mn0.hHbOE5lxYItxxuVprFjoeQHN6CgI4G3viKiLjZZPyIg'

// Wait for the Supabase library to load
document.addEventListener('DOMContentLoaded', () => {
    const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey)

    // Get DOM elements
    const emailForm = document.getElementById('emailForm')
    const emailInput = document.getElementById('email')
    const formMessage = document.getElementById('formMessage')

    // Handle form submission
    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        
        const email = emailInput.value.trim()
        
        try {
            // Clear previous messages
            formMessage.className = 'form-message'
            
            // Insert email into Supabase
            const { data, error } = await supabaseClient
                .from('subscribers')
                .insert([{ email, subscribed_at: new Date().toISOString() }])
            
            if (error) throw error
            
            // Show success message
            formMessage.textContent = 'Thank you for subscribing!'
            formMessage.classList.add('success')
            emailInput.value = ''
            
        } catch (error) {
            // Show error message
            formMessage.textContent = error.message === 'duplicate key value violates unique constraint "subscribers_email_key"'
                ? 'This email is already subscribed.'
                : 'Something went wrong. Please try again.'
            formMessage.classList.add('error')
            console.error('Error:', error)
        }
    })
}) 