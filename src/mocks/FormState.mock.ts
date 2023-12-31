export const mockGetWithJsonata = jest.fn();
const FormStateMock = jest.fn().mockImplementation(() => {
    return {
        getWithJsonata: mockGetWithJsonata,
    };
});

export default FormStateMock;
