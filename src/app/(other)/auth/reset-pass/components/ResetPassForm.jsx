import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import PasswordFormInput from '@/components/form/PasswordFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ResetPassForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState('');
  const [signature, setSignature] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { tenantSlug } = useParams();

  // Extract token and signature from URL when component mounts
  useEffect(() => {
    const urlToken = searchParams.get('token');
    const urlSignature = searchParams.get('signature');
    
    if (urlToken && urlSignature) {
      setToken(urlToken);
      setSignature(urlSignature);
    } else {
      toast.error('Invalid reset link. Please request a new password reset link.');
    }
  }, [searchParams]);

  // Validation schema
  const resetPasswordSchema = yup.object({
    password: yup.string()
      .required('Please enter a password')
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number'),
    password_confirmation: yup.string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password')
  });

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(resetPasswordSchema)
  });

  const onSubmit = async (data) => {
    if (!token || !signature) {
      toast.error('Invalid reset link. Please request a new password reset link.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Try landlord endpoint first
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/set-password`,
        {
          token,
          signature,
          password: data.password,
          password_confirmation: data.password_confirmation
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200) {
        toast.success('Password reset successfully!');
        navigate(`/${tenantSlug}/auth/sign-in`);
      } else {
        toast.error(response.data.message || 'Password reset failed');
      }

    } catch (landlordError) {
      // If landlord endpoint fails, try tenant endpoint
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/set-password`,
          {
            token,
            signature,
            password: data.password,
            password_confirmation: data.password_confirmation
          },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (response.status === 200) {
          toast.success('Password reset successfully!');
          navigate(`/${tenantSlug}/auth/sign-in`);
        } else {
          toast.error(response.data.message || 'Password reset failed');
        }
      } catch (tenantError) {
        console.error('Reset password error:', tenantError);
        
        // Show appropriate error message
        if (tenantError.response?.status === 401 || landlordError.response?.status === 401) {
          toast.error('Invalid or expired reset token. Please request a new password reset link.');
        } else if (tenantError.response?.data?.message) {
          toast.error(tenantError.response.data.message);
        } else {
          toast.error('An error occurred during password reset. Please try again.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
      <PasswordFormInput 
        control={control} 
        name="password" 
        containerClassName="mb-3" 
        placeholder="Enter your new password" 
        id="password-id" 
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
        label="New Password"
      />

      <PasswordFormInput 
        control={control} 
        name="password_confirmation" 
        containerClassName="mb-3" 
        placeholder="Confirm your new password" 
        id="password-confirm-id" 
        isInvalid={!!errors.password_confirmation}
        errorMessage={errors.password_confirmation?.message}
        label="Confirm New Password"
      />
      
      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </Button>
      </div>
    </form>
  );
};

export default ResetPassForm;



// import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
// import PasswordFormInput from '@/components/form/PasswordFormInput';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { Button } from 'react-bootstrap';
// import { useForm } from 'react-hook-form';
// import * as yup from 'yup';
// import axios from 'axios';
// import { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';

// const ResetPassForm = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [token, setToken] = useState('');
//   const [signature, setSignature] = useState('');
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const { tenantSlug } = useParams();

//   // Extract token and signature from URL when component mounts
//   useEffect(() => {
//     const urlToken = searchParams.get('token');
//     const urlSignature = searchParams.get('signature');
    
//     if (urlToken && urlSignature) {
//       setToken(urlToken);
//       setSignature(urlSignature);
//     } else {
//       toast.error('Invalid reset link. Please request a new password reset link.');
//     }
//   }, [searchParams]);

//   // Validation schema
//   const resetPasswordSchema = yup.object({
//     password: yup.string()
//       .required('Please enter a password')
//       .min(8, 'Password must be at least 8 characters')
//       .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
//       .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
//       .matches(/[0-9]/, 'Password must contain at least one number'),
//     password_confirmation: yup.string()
//       .oneOf([yup.ref('password'), null], 'Passwords must match')
//       .required('Please confirm your password')
//   });

//   const { control, handleSubmit, formState: { errors } } = useForm({
//     resolver: yupResolver(resetPasswordSchema)
//   });

//   const onSubmit = async (data) => {
//     if (!token || !signature) {
//       toast.error('Invalid reset link. Please request a new password reset link.');
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/set-password`,
//         {
//           token,
//           signature,
//           password: data.password,
//           password_confirmation: data.password_confirmation
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           }
//         }
//       );

//       if (response.status === 200) {
//         toast.success('Password reset successfully!');
//         // Use the actual tenantSlug variable instead of the string ':tenantSlug'
//         navigate(`/${tenantSlug}/auth/sign-in`);
//       } else {
//         toast.error(response.data.message || 'Password reset failed');
//       }
//     } catch (error) {
//       console.error('Reset password error:', error);
//       toast.error(error.response?.data?.message || 'An error occurred during password reset');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
//       <PasswordFormInput 
//         control={control} 
//         name="password" 
//         containerClassName="mb-3" 
//         placeholder="Enter your new password" 
//         id="password-id" 
//         isInvalid={!!errors.password}
//         errorMessage={errors.password?.message}
//         label="New Password"
//       />

//       <PasswordFormInput 
//         control={control} 
//         name="password_confirmation" 
//         containerClassName="mb-3" 
//         placeholder="Confirm your new password" 
//         id="password-confirm-id" 
//         isInvalid={!!errors.password_confirmation}
//         errorMessage={errors.password_confirmation?.message}
//         label="Confirm New Password"
//       />
      
//       <div className="mb-1 text-center d-grid">
//         <Button variant="primary" type="submit" disabled={isSubmitting}>
//           {isSubmitting ? 'Resetting...' : 'Reset Password'}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default ResetPassForm;





// import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
// import PasswordFormInput from '@/components/form/PasswordFormInput';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { Button } from 'react-bootstrap';
// import { useForm } from 'react-hook-form';
// import * as yup from 'yup';
// import axios from 'axios';
// import { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';

// const ResetPassForm = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [token, setToken] = useState('');
//   const [signature, setSignature] = useState('');
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//     const { tenantSlug } = useParams();

//     console.log(tenantSlug)

//   // Extract token and signature from URL when component mounts
//   useEffect(() => {
//     const urlToken = searchParams.get('token');
//     const urlSignature = searchParams.get('signature');
    
//     if (urlToken && urlSignature) {
//       setToken(urlToken);
//       setSignature(urlSignature);
//     } else {
//       toast.error('Invalid reset link. Please request a new password reset link.');
//     }
//   }, [searchParams]);

//   // Validation schema
//   const resetPasswordSchema = yup.object({
//     password: yup.string()
//       .required('Please enter a password')
//       .min(8, 'Password must be at least 8 characters')
//       .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
//       .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
//       .matches(/[0-9]/, 'Password must contain at least one number'),
//     password_confirmation: yup.string()
//       .oneOf([yup.ref('password'), null], 'Passwords must match')
//       .required('Please confirm your password')
//   });

//   const { control, handleSubmit, formState: { errors } } = useForm({
//     resolver: yupResolver(resetPasswordSchema)
//   });

//   const onSubmit = async (data) => {
//     if (!token || !signature) {
//       toast.error('Invalid reset link. Please request a new password reset link.');
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/${tenantSlug}/landlord/set-password`,
//         {
//           token,
//           signature,
//           password: data.password,
//           password_confirmation: data.password_confirmation
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           }
//         }
//       );

//       console.log(response)

//       if (response.status === 200) {
//         toast.success('Password reset successfully!');
//         navigate('/:tenantSlug/auth/sign-in');
//       } else {
//         toast.error(response.data.message || 'Password reset failed');
//       }
//     } catch (error) {
//       console.error('Reset password error:', error);
//       toast.error(error.response?.data?.message || 'An error occurred during password reset');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
//       <PasswordFormInput 
//         control={control} 
//         name="password" 
//         containerClassName="mb-3" 
//         placeholder="Enter your new password" 
//         id="password-id" 
//         isInvalid={!!errors.password}
//         errorMessage={errors.password?.message}
//         label="New Password"
//       />

//       <PasswordFormInput 
//         control={control} 
//         name="password_confirmation" 
//         containerClassName="mb-3" 
//         placeholder="Confirm your new password" 
//         id="password-confirm-id" 
//         isInvalid={!!errors.password_confirmation}
//         errorMessage={errors.password_confirmation?.message}
//         label="Confirm New Password"
//       />
      
//       <div className="mb-1 text-center d-grid">
//         <Button variant="primary" type="submit" disabled={isSubmitting}>
//           {isSubmitting ? 'Resetting...' : 'Reset Password'}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default ResetPassForm;