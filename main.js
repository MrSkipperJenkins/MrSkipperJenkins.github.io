// Initialize Supabase client
const supabaseUrl = 'https://cerwpqdmamkxokvoopwu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcndwcWRtYW1reG9rdm9vcHd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODgxOTIsImV4cCI6MjA1NzA2NDE5Mn0.hHbOE5lxYItxxuVprFjoeQHN6CgI4G3viKiLjZZPyIg'

function initializeSupabase() {
    if (typeof supabase === 'undefined') {
        console.error('Supabase client not loaded')
        return null
    }
    return supabase.createClient(supabaseUrl, supabaseKey)
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
}

// Wait for the DOM and Supabase to load
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const emailForm = document.getElementById('emailForm')
    const emailInput = document.getElementById('email')
    const submitButton = emailForm.querySelector('button[type="submit"]')
    const buttonText = submitButton.querySelector('.button-text')
    const formMessage = document.getElementById('formMessage')

    // Initialize Supabase client
    const supabaseClient = initializeSupabase()
    if (!supabaseClient) {
        formMessage.textContent = 'Error: Unable to initialize form. Please try again later.'
        formMessage.classList.add('error')
        return
    }

    // Handle input validation
    emailInput.addEventListener('input', () => {
        const email = emailInput.value.trim()
        
        // Clear previous states
        emailInput.classList.remove('error', 'success')
        formMessage.className = 'form-message'
        formMessage.textContent = ''
        
        if (email === '') {
            return
        }

        if (!validateEmail(email)) {
            emailInput.classList.add('error')
            formMessage.textContent = 'Please enter a valid email address'
            formMessage.classList.add('error')
        } else {
            emailInput.classList.add('success')
        }
    })

    // Handle form submission
    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        
        const email = emailInput.value.trim()
        
        // Validate email
        if (!validateEmail(email)) {
            emailInput.classList.add('error')
            formMessage.textContent = 'Please enter a valid email address'
            formMessage.classList.add('error')
            return
        }

        try {
            // Clear previous messages and set loading state
            formMessage.className = 'form-message'
            formMessage.textContent = ''
            submitButton.classList.add('loading')
            submitButton.disabled = true
            buttonText.textContent = 'Submitting...'
            
            // Insert email into Supabase
            const { data, error } = await supabaseClient
                .from('subscribers')
                .insert([{ email, subscribed_at: new Date().toISOString() }])
            
            if (error) throw error
            
            // Show success message
            emailInput.classList.remove('error', 'success')
            formMessage.textContent = 'Thank you for subscribing!'
            formMessage.classList.add('success')
            emailInput.value = ''
            
        } catch (error) {
            // Show error message
            emailInput.classList.add('error')
            if (error.message === 'duplicate key value violates unique constraint "subscribers_email_key"') {
                formMessage.textContent = 'This email is already subscribed.'
            } else {
                formMessage.textContent = 'Something went wrong. Please try again.'
                console.error('Error:', error)
            }
            formMessage.classList.add('error')
        } finally {
            // Reset button state
            submitButton.classList.remove('loading')
            submitButton.disabled = false
            buttonText.textContent = 'Submit'
        }
    })
}) 